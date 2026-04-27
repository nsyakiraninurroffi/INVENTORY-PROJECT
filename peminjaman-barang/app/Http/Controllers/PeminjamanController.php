<?php
namespace App\Http\Controllers;

use App\Models\{Peminjaman, DetailPeminjaman, Barang};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PeminjamanController extends Controller {
    public function index() {
        $list = Peminjaman::with(['user','details.barang'])->latest()->get();
        $barangs = Barang::where('stok','>',0)->where('status','tersedia')->get();
        return view('peminjaman.index', compact('list','barangs'));
    }

    public function store(Request $r) {
        $r->validate([
            'nama_peminjam'=>'required','tgl_pinjam'=>'required|date',
            'tgl_kembali'=>'required|date|after_or_equal:tgl_pinjam',
            'items'=>'required|array|min:1',
        ]);

        DB::transaction(function() use ($r) {
            $total = collect($r->items)->sum('jumlah');
            $p = Peminjaman::create([
                'id_user'=>auth()->id(),
                'nama_peminjam'=>$r->nama_peminjam,
                'jumlah_item'=>$total,
                'tgl_pinjam'=>$r->tgl_pinjam,
                'tgl_kembali'=>$r->tgl_kembali,
                'catatan'=>$r->catatan,
                'status'=>'aktif',
            ]);
            foreach ($r->items as $it) {
                DetailPeminjaman::create([
                    'id_pinjam'=>$p->id, 'id_barang'=>$it['id_barang'],
                    'jumlah'=>$it['jumlah'], 'status'=>'dipinjam',
                ]);
                $b = Barang::find($it['id_barang']);
                $b->stok -= $it['jumlah'];
                if ($b->stok <= 0) $b->status = 'habis';
                $b->save();
            }
        });
        return redirect()->route('peminjaman.index')->with('success','Peminjaman berhasil');
    }

    public function kembalikan(Peminjaman $peminjaman) {
        DB::transaction(function() use ($peminjaman) {
            foreach ($peminjaman->details as $d) {
                if ($d->status === 'dipinjam') {
                    $b = Barang::find($d->id_barang);
                    $b->stok += $d->jumlah;
                    $b->status = 'tersedia';
                    $b->save();
                    $d->update(['status'=>'dikembalikan']);
                }
            }
            $peminjaman->update(['status'=>'selesai']);
        });
        return back()->with('success','Pengembalian berhasil');
    }
}
