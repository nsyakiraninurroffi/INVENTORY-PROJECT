<?php
namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BarangController extends Controller {
    public function index(Request $r) {
        $q = Barang::with('kategori');
        if ($r->search)   $q->where('nama','like','%'.$r->search.'%');
        if ($r->kategori) $q->where('id_kat', $r->kategori);
        if ($r->status)   $q->where('status', $r->status);
        $barangs = $q->latest()->paginate(12);
        $kategoris = Kategori::all();
        return view('barang.index', compact('barangs','kategoris'));
    }

    public function store(Request $r) {
        $data = $r->validate([
            'nama'=>'required','stok'=>'required|integer|min:0',
            'id_kat'=>'required|exists:kategoris,id',
            'status'=>'required|in:tersedia,habis,rusak',
            'deskripsi'=>'nullable',
            'gambar'=>'nullable|image|max:2048',
        ]);
        if ($r->hasFile('gambar')) {
            $data['gambar'] = $r->file('gambar')->store('barang','public');
        }
        Barang::create($data);
        return redirect()->route('barang.index')->with('success','Barang ditambahkan');
    }

    public function update(Request $r, Barang $barang) {
        $data = $r->validate([
            'nama'=>'required','stok'=>'required|integer|min:0',
            'id_kat'=>'required|exists:kategoris,id',
            'status'=>'required','deskripsi'=>'nullable',
            'gambar'=>'nullable|image|max:2048',
        ]);
        if ($r->hasFile('gambar')) {
            if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
            $data['gambar'] = $r->file('gambar')->store('barang','public');
        }
        $barang->update($data);
        return redirect()->route('barang.index')->with('success','Barang diupdate');
    }

    public function destroy(Barang $barang) {
        if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
        $barang->delete();
        return back()->with('success','Barang dihapus');
    }

    // Bulk action
    public function bulkDestroy(Request $r) {
        Barang::whereIn('id', $r->ids)->delete();
        return back()->with('success','Bulk delete berhasil');
    }
}
