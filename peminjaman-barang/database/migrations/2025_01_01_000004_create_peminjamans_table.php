<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('peminjamans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->string('nama_peminjam');
            $table->integer('jumlah_item');
            $table->date('tgl_pinjam');
            $table->date('tgl_kembali');
            $table->enum('status', ['aktif', 'selesai', 'terlambat'])->default('aktif');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('peminjamans'); }
};
