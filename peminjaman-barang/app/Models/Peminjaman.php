<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model {
    protected $fillable = ['id_user', 'nama_peminjam', 'jumlah_item', 'tgl_pinjam', 'tgl_kembali', 'status', 'catatan'];

    public function user() {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function details() {
        return $this->hasMany(DetailPeminjaman::class, 'id_pinjam');
    }
}
