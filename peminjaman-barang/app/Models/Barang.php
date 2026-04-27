<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model {
    protected $fillable = ['nama', 'stok', 'id_kat', 'status', 'gambar', 'deskripsi'];

    public function kategori() {
        return $this->belongsTo(Kategori::class, 'id_kat');
    }
    public function detailPeminjamans() {
        return $this->hasMany(DetailPeminjaman::class, 'id_barang');
    }
}
