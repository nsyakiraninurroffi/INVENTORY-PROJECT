<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\{User, Kategori, Barang};

class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Users
        User::create(['username'=>'admin','password'=>Hash::make('admin'),'nama'=>'Administrator','email'=>'admin@sipinjam.id','role'=>'admin']);
        User::create(['username'=>'petugas','password'=>Hash::make('petugas'),'nama'=>'Budi Petugas','email'=>'budi@sipinjam.id','role'=>'petugas']);
        User::create(['username'=>'siti','password'=>Hash::make('123'),'nama'=>'Siti Nuraini','email'=>'siti@student.id','role'=>'peminjam']);

        // Kategori
        $elektronik = Kategori::create(['nama'=>'Elektronik','deskripsi'=>'Perangkat elektronik untuk lab & multimedia.']);
        $olahraga   = Kategori::create(['nama'=>'Olahraga','deskripsi'=>'Peralatan olahraga indoor & outdoor.']);
        $atk        = Kategori::create(['nama'=>'Alat Tulis','deskripsi'=>'Perlengkapan kerja & seminar.']);
        $furniture  = Kategori::create(['nama'=>'Furniture','deskripsi'=>'Meja, kursi, dan perlengkapan ruangan.']);

        // Barang
        Barang::create(['nama'=>'Proyektor Epson EB-S41','stok'=>5,'id_kat'=>$elektronik->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Laptop Asus Vivobook','stok'=>3,'id_kat'=>$elektronik->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Bola Basket Molten','stok'=>8,'id_kat'=>$olahraga->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Whiteboard Marker','stok'=>25,'id_kat'=>$atk->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Kursi Lipat','stok'=>40,'id_kat'=>$furniture->id,'status'=>'tersedia']);
    }
}
