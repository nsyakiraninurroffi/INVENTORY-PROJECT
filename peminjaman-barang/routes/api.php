<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\PeminjamanController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\UserController;

// Public
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected (butuh token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Resource API standar (CRUD)
    Route::apiResource('kategori', KategoriController::class);
    Route::apiResource('barang', BarangController::class);
    Route::apiResource('peminjaman', PeminjamanController::class);

    // Aksi khusus
    Route::post('/peminjaman/{id}/kembalikan', [PeminjamanController::class, 'kembalikan']);
    Route::delete('/bulk/kategori', [KategoriController::class, 'bulkDelete']);
    Route::delete('/bulk/barang', [BarangController::class, 'bulkDelete']);

    // User management (admin)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // Laporan
    Route::get('/laporan', [LaporanController::class, 'index']);
    Route::get('/laporan/excel', [LaporanController::class, 'exportExcel']);
    Route::get('/laporan/pdf', [LaporanController::class, 'exportPdf']);
    Route::get('/dashboard/stats', [LaporanController::class, 'dashboardStats']);
});
