<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Peminjaman</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #333; }
        h1 { color: #ec4899; margin: 0; }
        .header { border-bottom: 3px solid #a855f7; padding-bottom: 10px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; padding: 8px; text-align: left; }
        td { padding: 7px 8px; border-bottom: 1px solid #f0e6f5; }
        tr:nth-child(even) td { background: #fdf6fb; }
        .status { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .aktif { background: #fef3c7; color: #92400e; }
        .selesai { background: #d1fae5; color: #065f46; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Laporan Peminjaman Barang</h1>
        <p>Tanggal cetak: {{ now()->format('d F Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Peminjam</th>
                <th>Tgl Pinjam</th>
                <th>Tgl Kembali</th>
                <th>Item</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $p)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $p->nama_peminjam }}</td>
                    <td>{{ $p->tgl_pinjam }}</td>
                    <td>{{ $p->tgl_kembali }}</td>
                    <td>{{ $p->jumlah_item }}</td>
                    <td><span class="status {{ $p->status }}">{{ ucfirst($p->status) }}</span></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 30px; color: #666; font-size: 10px;">
        Dihasilkan otomatis oleh sistem SiPinjam · Total: {{ $data->count() }} peminjaman
    </p>
</body>
</html>