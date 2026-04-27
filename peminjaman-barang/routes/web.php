<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController, DashboardController, KategoriController,
    BarangController, PeminjamanController, LaporanController, AkunController, ProfilController};

Route::get('/login', [AuthController::class,'showLogin'])->name('login');
Route::post('/login', [AuthController::class,'login']);

Route::middleware('auth')->group(function() {
    Route::post('/logout', [AuthController::class,'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class,'index'])->name('dashboard');

    Route::resource('kategori', KategoriController::class);
    Route::resource('barang', BarangController::class);
    Route::post('barang/bulk-destroy', [BarangController::class,'bulkDestroy']);

    Route::resource('peminjaman', PeminjamanController::class);
    Route::post('peminjaman/{peminjaman}/kembalikan', [PeminjamanController::class,'kembalikan'])
        ->name('peminjaman.kembalikan');

    Route::middleware('role:admin')->group(function() {
        Route::resource('akun', AkunController::class);
    });

    Route::get('/laporan', [LaporanController::class,'index'])->name('laporan.index');
    Route::get('/laporan/excel', [LaporanController::class,'exportExcel'])->name('laporan.excel');
    Route::get('/laporan/pdf', [LaporanController::class,'exportPdf'])->name('laporan.pdf');

    Route::get('/profil', [ProfilController::class,'edit'])->name('profil.edit');
    Route::put('/profil', [ProfilController::class,'update'])->name('profil.update');
});