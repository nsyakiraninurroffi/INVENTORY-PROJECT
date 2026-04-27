<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use App\Models\Barang;
use App\Models\DetailPeminjaman;
use App\Exports\PeminjamanExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    public function index(Request $request) {
        $q = Peminjaman::with('user', 'details.barang');
        if ($from = $request->from) $q->whereDate('tgl_pinjam', '>=', $from);
        if ($to   = $request->to)   $q->whereDate('tgl_pinjam', '<=', $to);
        if ($st   = $request->status) $q->where('status', $st);
        return response()->json($q->latest()->get());
    }

    public function dashboardStats() {
        // Top 5 barang paling sering dipinjam
        $topBarang = DetailPeminjaman::select('id_barang', DB::raw('SUM(jumlah) as total'))
            ->with('barang')
            ->groupBy('id_barang')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Peminjaman per bulan (6 bulan terakhir)
        $perBulan = Peminjaman::select(
                DB::raw('DATE_FORMAT(tgl_pinjam, "%Y-%m") as bulan'),
                DB::raw('COUNT(*) as total')
            )
            ->whereDate('tgl_pinjam', '>=', now()->subMonths(6))
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        // Stok tersedia vs dipinjam
        $stokTersedia = Barang::sum('stok');
        $stokDipinjam = DetailPeminjaman::where('status', 'dipinjam')->sum('jumlah');

        return response()->json([
            'top_barang'    => $topBarang,
            'per_bulan'     => $perBulan,
            'stok_tersedia' => $stokTersedia,
            'stok_dipinjam' => $stokDipinjam,
            'total_pinjam'  => Peminjaman::count(),
            'aktif'         => Peminjaman::where('status', 'dipinjam')->count(),
        ]);
    }

    public function exportExcel(Request $request) {
        return Excel::download(new PeminjamanExport($request->all()), 'laporan-peminjaman.xlsx');
    }

    public function exportPdf(Request $request) {
        $data = Peminjaman::with('user', 'details.barang')
            ->when($request->from, fn($q) => $q->whereDate('tgl_pinjam', '>=', $request->from))
            ->when($request->to,   fn($q) => $q->whereDate('tgl_pinjam', '<=', $request->to))
            ->latest()->get();

        $pdf = Pdf::loadView('exports.peminjaman-pdf', ['data' => $data]);
        return $pdf->download('laporan-peminjaman.pdf');
    }
}
