<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBarang = Barang::count();
        $totalKategori = Kategori::count();
        $aktif = Peminjaman::where('status', 'aktif')->count();
        $totalUser = User::count();
        $labels = [];
        $data = [];
        return view('dashboard', compact('totalBarang', 'totalKategori', 'aktif', 'totalUser', 'labels', 'data'));
    }
}
