<?php
namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\PeminjamanExport;

class LaporanController extends Controller {
    public function index(Request $r) {
        $from = $r->from ?? now()->startOfMonth()->toDateString();
        $to   = $r->to   ?? now()->endOfMonth()->toDateString();
        $list = Peminjaman::with('details.barang')
            ->whereBetween('tgl_pinjam', [$from, $to])->get();
        return view('laporan.index', compact('list','from','to'));
    }

    public function exportExcel(Request $r) {
        return Excel::download(new PeminjamanExport($r->from, $r->to), 'laporan.xlsx');
    }

    public function exportPdf(Request $r) {
        $list = Peminjaman::with('details.barang')
            ->whereBetween('tgl_pinjam', [$r->from, $r->to])->get();
        $pdf = Pdf::loadView('laporan.pdf', compact('list'));
        return $pdf->download('laporan.pdf');
    }
}
