<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use App\Services\PeminjamanService;
use Illuminate\Http\Request;

class PeminjamanController extends Controller
{
    public function __construct(protected PeminjamanService $service) {}

    public function index(Request $request) {
        $q = Peminjaman::with('user', 'details.barang')->latest();

        if ($status = $request->status)         $q->where('status', $status);
        if ($from   = $request->from)           $q->whereDate('tgl_pinjam', '>=', $from);
        if ($to     = $request->to)             $q->whereDate('tgl_pinjam', '<=', $to);
        if ($s      = $request->q)              $q->where('nama_peminjam', 'like', "%$s%");

        // Peminjam hanya lihat data sendiri
        if ($request->user()->role === 'peminjam') {
            $q->where('id_user', $request->user()->id);
        }

        return response()->json($q->paginate($request->per_page ?? 15));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'id_user'        => 'required|exists:users,id',
            'nama_peminjam'  => 'required|string',
            'tgl_pinjam'     => 'required|date',
            'tgl_kembali'    => 'required|date|after_or_equal:tgl_pinjam',
            'catatan'        => 'nullable|string',
            'items'          => 'required|array|min:1',
            'items.*.id_barang' => 'required|exists:barangs,id',
            'items.*.jumlah'    => 'required|integer|min:1',
        ]);

        try {
            $peminjaman = $this->service->pinjam($data);
            return response()->json($peminjaman, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Peminjaman $peminjaman) {
        return response()->json($peminjaman->load('user', 'details.barang'));
    }

    public function update(Request $request, Peminjaman $peminjaman) {
        $data = $request->validate([
            'tgl_kembali' => 'sometimes|date',
            'catatan'     => 'nullable|string',
            'status'      => 'sometimes|in:dipinjam,dikembalikan,terlambat',
        ]);
        $peminjaman->update($data);
        return response()->json($peminjaman);
    }

    public function destroy(Peminjaman $peminjaman) {
        $peminjaman->delete();
        return response()->json(['message' => 'Peminjaman dihapus']);
    }

    public function kembalikan(int $id) {
        try {
            $peminjaman = $this->service->kembalikan($id);
            return response()->json([
                'message'    => 'Pengembalian berhasil',
                'peminjaman' => $peminjaman,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
