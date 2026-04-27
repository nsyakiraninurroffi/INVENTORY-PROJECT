import React from 'react';
import { Plus, Trash2, Search, Check, Calendar, Package, X } from 'lucide-react';
import { api, useStore } from '../store';
import { Card, PageHeader, Button, Modal, Input, Select, Label, Badge, EmptyState } from '../components/UI';

const STATUS_COLORS: any = { aktif: 'amber', selesai: 'green', terlambat: 'red' };

export function PeminjamanPage() {
  const peminjaman = useStore((s) => s.peminjaman);
  const barang = useStore((s) => s.barang);
  const user = useStore(() => api.currentUser());
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

  const filtered = peminjaman.filter((p) => {
    const okQ = p.nama_peminjam.toLowerCase().includes(q.toLowerCase());
    const okS = !filterStatus || p.status === filterStatus;
    const okR = user?.role === 'peminjam' ? p.id_user === user.id : true;
    return okQ && okS && okR;
  });

  return (
    <div>
      <PageHeader
        title="Peminjaman & Pengembalian"
        subtitle="Kelola transaksi peminjaman barang"
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Pinjam Baru</Button>}
      />

      <Card className="mb-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama peminjam..." className="input w-full pl-10 pr-3 py-2.5 rounded-xl text-sm" />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState title="Belum ada peminjaman" /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} className="!p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-white/45 font-mono">#PJM-{String(p.id).padStart(4, '0')}</span>
                    <Badge color={STATUS_COLORS[p.status]}>{p.status}</Badge>
                  </div>
                  <div className="font-semibold text-lg mb-1">{p.nama_peminjam}</div>
                  {p.catatan && <div className="text-sm text-white/55 mb-2">{p.catatan}</div>}
                  <div className="flex flex-wrap gap-3 text-xs text-white/50 mt-2">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Pinjam: {p.tgl_pinjam}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Kembali: {p.tgl_kembali}</span>
                    <span className="flex items-center gap-1"><Package size={12} /> {p.jumlah_item} item</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.details.map((d) => {
                      const b = barang.find((x) => x.id === d.id_barang);
                      return (
                        <span key={d.id} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
                          {b?.nama || '?'} <span className="text-white/40">×{d.jumlah}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  {p.status === 'aktif' && (
                    <Button onClick={() => confirm('Konfirmasi pengembalian?') && api.kembalikan(p.id)}>
                      <Check size={14} /> Kembalikan
                    </Button>
                  )}
                  {user?.role === 'admin' && (
                    <Button variant="danger" onClick={() => confirm('Hapus transaksi?') && api.deletePeminjaman(p.id)}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PinjamModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function PinjamModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const barang = useStore((s) => s.barang);
  const config = useStore((s) => s.config);
  const user = useStore(() => api.currentUser());
  const today = new Date().toISOString().slice(0, 10);
  const defaultReturn = new Date(Date.now() + config.maxPinjamHari * 86400000).toISOString().slice(0, 10);

  const [form, setForm] = React.useState({
    nama_peminjam: user?.nama || '',
    tgl_pinjam: today,
    tgl_kembali: defaultReturn,
    catatan: '',
  });
  const [items, setItems] = React.useState<{ id_barang: number; jumlah: number }[]>([]);
  const [pickId, setPickId] = React.useState<number>(0);
  const [pickQty, setPickQty] = React.useState(1);

  React.useEffect(() => {
    if (open) {
      setForm({ nama_peminjam: user?.nama || '', tgl_pinjam: today, tgl_kembali: defaultReturn, catatan: '' });
      setItems([]);
      const tersedia = barang.find((b) => b.status === 'tersedia' && b.stok > 0);
      setPickId(tersedia?.id || 0);
      setPickQty(1);
    }
    // eslint-disable-next-line
  }, [open]);

  const addItem = () => {
    if (!pickId) return;
    const b = barang.find((x) => x.id === pickId);
    if (!b || pickQty < 1 || pickQty > b.stok) return;
    setItems((arr) => {
      const ex = arr.find((i) => i.id_barang === pickId);
      if (ex) return arr.map((i) => (i.id_barang === pickId ? { ...i, jumlah: Math.min(b.stok, i.jumlah + pickQty) } : i));
      return [...arr, { id_barang: pickId, jumlah: pickQty }];
    });
    setPickQty(1);
  };

  const submit = () => {
    if (!form.nama_peminjam.trim() || items.length === 0 || !user) return;
    api.createPeminjaman({
      id_user: user.id,
      nama_peminjam: form.nama_peminjam,
      tgl_pinjam: form.tgl_pinjam,
      tgl_kembali: form.tgl_kembali,
      catatan: form.catatan,
      items,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Form Peminjaman Barang" size="lg">
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Nama Peminjam</Label>
            <Input value={form.nama_peminjam} onChange={(e) => setForm({ ...form, nama_peminjam: e.target.value })} />
          </div>
          <div>
            <Label>Catatan</Label>
            <Input value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Keperluan..." />
          </div>
          <div>
            <Label>Tanggal Pinjam</Label>
            <Input type="date" value={form.tgl_pinjam} onChange={(e) => setForm({ ...form, tgl_pinjam: e.target.value })} />
          </div>
          <div>
            <Label>Tanggal Kembali</Label>
            <Input type="date" value={form.tgl_kembali} onChange={(e) => setForm({ ...form, tgl_kembali: e.target.value })} />
          </div>
        </div>

        <div>
          <Label>Tambah Item</Label>
          <div className="flex gap-2">
            <Select value={pickId} onChange={(e) => setPickId(Number(e.target.value))} className="flex-1">
              <option value={0}>-- Pilih barang --</option>
              {barang.filter((b) => b.stok > 0 && b.status === 'tersedia').map((b) => (
                <option key={b.id} value={b.id}>{b.nama} (stok: {b.stok})</option>
              ))}
            </Select>
            <Input type="number" min={1} value={pickQty} onChange={(e) => setPickQty(Number(e.target.value))} className="!w-24" />
            <Button variant="ghost" onClick={addItem} type="button"><Plus size={14} /></Button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            {items.map((i, idx) => {
              const b = barang.find((x) => x.id === i.id_barang);
              return (
                <div key={i.id_barang} className={`flex items-center justify-between p-3 ${idx > 0 ? 'border-t border-white/5' : ''}`}>
                  <div>
                    <div className="text-sm">{b?.nama}</div>
                    <div className="text-xs text-white/40">Jumlah: {i.jumlah}</div>
                  </div>
                  <button onClick={() => setItems(items.filter((x) => x.id_barang !== i.id_barang))} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300">
                    <X size={14} />
                  </button>
                </div>
              );
            })}
            <div className="p-3 bg-white/[0.03] text-sm flex justify-between">
              <span className="text-white/60">Total Item</span>
              <span className="font-semibold">{items.reduce((a, b) => a + b.jumlah, 0)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button onClick={submit} disabled={items.length === 0}>Buat Peminjaman</Button>
        </div>
      </div>
    </Modal>
  );
}
