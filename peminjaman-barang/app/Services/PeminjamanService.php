<?php
namespace App\Services;

use App\Models\Barang;
use App\Models\Peminjaman;
use App\Models\DetailPeminjaman;
use Illuminate\Support\Facades\DB;
use Exception;

class PeminjamanService
{
    /**
     * Buat transaksi peminjaman baru.
     * Atomic: stok berkurang + detail dibuat dalam satu transaksi DB.
     */
    public function pinjam(array $data): Peminjaman {
        return DB::transaction(function () use ($data) {

            // 1. Validasi & lock stok
            foreach ($data['items'] as $item) {
                $barang = Barang::lockForUpdate()->findOrFail($item['id_barang']);
                if ($barang->stok < $item['jumlah']) {
                    throw new Exception("Stok '{$barang->nama}' tidak cukup (tersisa {$barang->stok})");
                }
            }

            // 2. Buat header peminjaman
            $peminjaman = Peminjaman::create([
                'id_user'       => $data['id_user'],
                'nama_peminjam' => $data['nama_peminjam'],
                'jumlah_item'   => collect($data['items'])->sum('jumlah'),
                'tgl_pinjam'    => $data['tgl_pinjam'],
                'tgl_kembali'   => $data['tgl_kembali'],
                'status'        => 'dipinjam',
                'catatan'       => $data['catatan'] ?? null,
            ]);

            // 3. Buat detail + kurangi stok
            foreach ($data['items'] as $item) {
                DetailPeminjaman::create([
                    'id_pinjam' => $peminjaman->id,
                    'id_barang' => $item['id_barang'],
                    'jumlah'    => $item['jumlah'],
                    'status'    => 'dipinjam',
                ]);

                $barang = Barang::find($item['id_barang']);
                $barang->stok -= $item['jumlah'];
                if ($barang->stok === 0) $barang->status = 'habis';
                $barang->save();
            }

            return $peminjaman->load('details.barang', 'user');
        });
    }

    /**
     * Proses pengembalian — kembalikan stok dan ubah status.
     */
    public function kembalikan(int $id): Peminjaman {
        return DB::transaction(function () use ($id) {
            $peminjaman = Peminjaman::with('details.barang')->lockForUpdate()->findOrFail($id);

            if ($peminjaman->status === 'dikembalikan') {
                throw new Exception('Peminjaman ini sudah dikembalikan.');
            }

            foreach ($peminjaman->details as $det) {
                if ($det->status === 'dipinjam') {
                    $barang = Barang::lockForUpdate()->find($det->id_barang);
                    $barang->stok  += $det->jumlah;
                    $barang->status = 'tersedia';
                    $barang->save();

                    $det->status = 'dikembalikan';
                    $det->save();
                }
            }

            $peminjaman->status = 'dikembalikan';
            $peminjaman->save();

            return $peminjaman;
        });
    }
}
