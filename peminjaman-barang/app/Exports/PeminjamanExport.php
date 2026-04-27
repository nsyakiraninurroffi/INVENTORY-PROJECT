<?php
namespace App\Exports;

use App\Models\Peminjaman;
use Maatwebsite\Excel\Concerns\{FromCollection, WithHeadings, WithMapping};

class PeminjamanExport implements FromCollection, WithHeadings, WithMapping {
    public function __construct(public $from, public $to) {}

    public function collection() {
        return Peminjaman::with('user')
            ->whereBetween('tgl_pinjam', [$this->from, $this->to])->get();
    }

    public function headings(): array {
        return ['ID', 'Peminjam', 'Tgl Pinjam', 'Tgl Kembali', 'Jumlah Item', 'Status'];
    }

    public function map($p): array {
        return ['PJM-'.str_pad($p->id,4,'0',STR_PAD_LEFT), $p->nama_peminjam,
            $p->tgl_pinjam, $p->tgl_kembali, $p->jumlah_item, $p->status];
    }
}
