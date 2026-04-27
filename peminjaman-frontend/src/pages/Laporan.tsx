import React from 'react';
import { FileSpreadsheet, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { Card, PageHeader, Button, Badge, Input, Label } from '../components/UI';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';

const STATUS_COLORS: any = { aktif: 'amber', selesai: 'green', terlambat: 'red' };

export function LaporanPage() {
  const peminjaman = useStore((s) => s.peminjaman);
  const barang = useStore((s) => s.barang);
  const config = useStore((s) => s.config);
  const [from, setFrom] = React.useState('2026-01-01');
  const [to, setTo] = React.useState('2026-12-31');

  const filtered = peminjaman.filter((p) => p.tgl_pinjam >= from && p.tgl_pinjam <= to);

  const totalTransaksi = filtered.length;
  const totalItemDipinjam = filtered.reduce((a, p) => a + p.jumlah_item, 0);
  const aktif = filtered.filter((p) => p.status === 'aktif').length;
  const selesai = filtered.filter((p) => p.status === 'selesai').length;

  // Top barang
  const itemCount: Record<number, number> = {};
  filtered.forEach((p) => p.details.forEach((d) => { itemCount[d.id_barang] = (itemCount[d.id_barang] || 0) + d.jumlah; }));
  const topBarang = Object.entries(itemCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, qty]) => ({ nama: barang.find((b) => b.id === Number(id))?.nama || '?', qty }));

  const chartData = {
    labels: topBarang.map((t) => t.nama),
    datasets: [{
      label: 'Total Dipinjam',
      data: topBarang.map((t) => t.qty),
      backgroundColor: 'rgba(96,165,250,0.7)',
      borderRadius: 8,
    }],
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((p) => ({
        ID: `PJM-${String(p.id).padStart(4, '0')}`,
        Peminjam: p.nama_peminjam,
        'Tgl Pinjam': p.tgl_pinjam,
        'Tgl Kembali': p.tgl_kembali,
        Jumlah: p.jumlah_item,
        Status: p.status,
        Catatan: p.catatan || '',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Peminjaman');
    XLSX.writeFile(wb, `laporan-peminjaman-${from}-sd-${to}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(config.appName + ' - Laporan Peminjaman', 14, 18);
    doc.setFontSize(10);
    doc.text(`Periode: ${from} s/d ${to}`, 14, 26);
    doc.text(`Total Transaksi: ${totalTransaksi} | Total Item: ${totalItemDipinjam}`, 14, 32);

    autoTable(doc, {
      startY: 38,
      head: [['ID', 'Peminjam', 'Tgl Pinjam', 'Tgl Kembali', 'Jumlah', 'Status']],
      body: filtered.map((p) => [
        `PJM-${String(p.id).padStart(4, '0')}`,
        p.nama_peminjam,
        p.tgl_pinjam,
        p.tgl_kembali,
        String(p.jumlah_item),
        p.status,
      ]),
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 9 },
    });
    doc.save(`laporan-peminjaman-${from}-sd-${to}.pdf`);
  };

  return (
    <div>
      <PageHeader
        title="Laporan"
        subtitle="Analisa & ekspor data peminjaman"
        actions={
          <>
            <Button variant="ghost" onClick={exportExcel}><FileSpreadsheet size={14} /> Export Excel</Button>
            <Button onClick={exportPDF}><FileText size={14} /> Export PDF</Button>
          </>
        }
      />

      <Card className="mb-4">
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <div>
            <Label>Dari Tanggal</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label>Sampai Tanggal</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="text-xs text-white/50 flex items-center gap-2">
            <Calendar size={14} /> Menampilkan {filtered.length} transaksi pada periode tersebut.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { l: 'Total Transaksi', v: totalTransaksi },
          { l: 'Total Item Dipinjam', v: totalItemDipinjam },
          { l: 'Sedang Aktif', v: aktif, c: 'amber' },
          { l: 'Selesai', v: selesai, c: 'green' },
        ].map((s, i) => (
          <Card key={i}>
            <div className="text-xs text-white/50">{s.l}</div>
            <div className="text-3xl font-semibold mt-1">{s.v}</div>
            {s.c && <div className="mt-2"><Badge color={s.c as any}>periode</Badge></div>}
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="font-semibold mb-1 flex items-center gap-2"><TrendingUp size={16} /> Top 5 Barang Paling Dipinjam</div>
          <div className="text-xs text-white/50 mb-4">Berdasarkan periode</div>
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                  y: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { display: false } },
                },
              }}
            />
          </div>
        </Card>

        <Card>
          <div className="font-semibold mb-3">Detail Transaksi</div>
          <div className="max-h-72 overflow-y-auto space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{p.nama_peminjam}</div>
                  <div className="text-xs text-white/40">PJM-{String(p.id).padStart(4, '0')} · {p.tgl_pinjam}</div>
                </div>
                <Badge color={STATUS_COLORS[p.status]}>{p.status}</Badge>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-sm text-white/40 text-center py-6">Tidak ada data</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
