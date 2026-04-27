<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function index(Request $request) {
        $q = Kategori::query()->withCount('barangs');
        if ($search = $request->q) {
            $q->where('nama', 'like', "%$search%");
        }
        return response()->json($q->latest()->paginate($request->per_page ?? 15));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'nama'      => 'required|string|max:100|unique:kategoris',
            'deskripsi' => 'nullable|string',
        ]);
        return response()->json(Kategori::create($data), 201);
    }

    public function show(Kategori $kategori) {
        return response()->json($kategori->load('barangs'));
    }

    public function update(Request $request, Kategori $kategori) {
        $data = $request->validate([
            'nama'      => 'required|string|max:100|unique:kategoris,nama,' . $kategori->id,
            'deskripsi' => 'nullable|string',
        ]);
        $kategori->update($data);
        return response()->json($kategori);
    }

    public function destroy(Kategori $kategori) {
        $kategori->delete();
        return response()->json(['message' => 'Kategori dihapus']);
    }

    public function bulkDelete(Request $request) {
        $request->validate(['ids' => 'required|array']);
        Kategori::whereIn('id', $request->ids)->delete();
        return response()->json(['message' => 'Bulk delete berhasil']);
    }
}
