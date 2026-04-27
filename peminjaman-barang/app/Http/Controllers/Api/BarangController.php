<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BarangController extends Controller
{
    public function index(Request $request) {
        $q = Barang::with('kategori');

        if ($s = $request->q)        $q->where('nama', 'like', "%$s%");
        if ($k = $request->kategori) $q->where('id_kat', $k);
        if ($st = $request->status)  $q->where('status', $st);

        return response()->json($q->latest()->paginate($request->per_page ?? 15));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'nama'      => 'required|string|max:150',
            'stok'      => 'required|integer|min:0',
            'id_kat'    => 'required|exists:kategoris,id',
            'status'    => 'required|in:tersedia,habis,rusak',
            'deskripsi' => 'nullable|string',
            'gambar'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('barang', 'public');
        }

        return response()->json(Barang::create($data), 201);
    }

    public function show(Barang $barang) {
        return response()->json($barang->load('kategori'));
    }

    public function update(Request $request, Barang $barang) {
        $data = $request->validate([
            'nama'      => 'required|string|max:150',
            'stok'      => 'required|integer|min:0',
            'id_kat'    => 'required|exists:kategoris,id',
            'status'    => 'required|in:tersedia,habis,rusak',
            'deskripsi' => 'nullable|string',
            'gambar'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
            $data['gambar'] = $request->file('gambar')->store('barang', 'public');
        }

        $barang->update($data);
        return response()->json($barang);
    }

    public function destroy(Barang $barang) {
        if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
        $barang->delete();
        return response()->json(['message' => 'Barang dihapus']);
    }

    public function bulkDelete(Request $request) {
        $request->validate(['ids' => 'required|array']);
        Barang::whereIn('id', $request->ids)->delete();
        return response()->json(['message' => 'Bulk delete berhasil']);
    }
}
