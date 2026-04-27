<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->integer('stok')->default(0);
            $table->foreignId('id_kat')->constrained('kategoris')->onDelete('cascade');
            $table->enum('status', ['tersedia', 'habis', 'rusak'])->default('tersedia');
            $table->string('gambar')->nullable();
            $table->longText('deskripsi')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('barangs'); }
};
