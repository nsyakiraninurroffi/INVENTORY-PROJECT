<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPeminjaman extends Model {
    protected $fillable = ['id_pinjam', 'id_barang', 'jumlah', 'status'];

    public function peminjaman() {
        return $this->belongsTo(Peminjaman::class, 'id_pinjam');
    }
    public function barang() {
        return $this->belongsTo(Barang::class, 'id_barang');
    }
}
