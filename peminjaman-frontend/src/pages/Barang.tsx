import React from 'react';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import { api, useStore } from '../store';
import { Card, PageHeader, Button, Modal, Input, Select, Label, Badge, EmptyState, RichEditor, ImageUpload } from '../components/UI';
import type { Barang } from '../types';

const STATUS_COLORS = { tersedia: 'green', habis: 'amber', rusak: 'red' } as const;

export function BarangPage() {
  const barang = useStore((s) => s.barang);
  const kategori = useStore((s) => s.kategori);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Barang | null>(null);
  const [form, setForm] = React.useState<Partial<Barang>>({});
  const [q, setQ] = React.useState('');
  const [filterKat, setFilterKat] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [selected, setSelected] = React.useState<number[]>([]);

  const filtered = barang.filter((b) => {
    const okQ = b.nama.toLowerCase().includes(q.toLowerCase());
    const okK = !filterKat || b.id_kat === Number(filterKat);
    const okS = !filterStatus || b.status === filterStatus;
    return okQ && okK && okS;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ nama: '', stok: 0, id_kat: kategori[0]?.id, status: 'tersedia', deskripsi: '' });
    setOpen(true);
  };
  const openEdit = (b: Barang) => { setEditing(b); setForm({ ...b }); setOpen(true); };
  const save = () => {
    if (!form.nama?.trim()) return;
    api.saveBarang(editing ? { ...form, id: editing.id } : form);
    setOpen(false);
  };
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <PageHeader
        title="Manajemen Barang"
        subtitle="Kelola inventaris barang yang dapat dipinjam"
        actions={
          <>
            {selected.length > 0 && (
              <Button variant="danger" onClick={() => { api.bulkDeleteBarang(selected); setSelected([]); }}>
                <Trash2 size={14} /> Hapus ({selected.length})
              </Button>
            )}
            <Button onClick={openNew}><Plus size={16} /> Tambah Barang</Button>
          </>
        }
      />

      <Card className="mb-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search size={16} className="absolute left-3 top-3 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama barang..." className="input w-full pl-10 pr-3 py-2.5 rounded-xl text-sm" />
          </div>
          <Select value={filterKat} onChange={(e) => setFilterKat(e.target.value)}>
            <option value="">Semua Kategori</option>
            {kategori.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="habis">Habis</option>
            <option value="rusak">Rusak</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState title="Tidak ada barang" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((b) => {
            const kat = kategori.find((k) => k.id === b.id_kat);
            const isSel = selected.includes(b.id);
            return (
              <Card key={b.id} className={`!p-0 overflow-hidden group transition ${isSel ? 'ring-2 ring-violet-400' : ''}`}>
                <div className="aspect-video relative bg-gradient-to-br from-violet-500/20 to-blue-500/20 overflow-hidden">
                  {b.gambar ? (
                    <img src={b.gambar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={40} className="text-white/30" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <input type="checkbox" checked={isSel} onChange={() => toggle(b.id)} className="w-4 h-4" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge color={STATUS_COLORS[b.status]}>{b.status}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-white/45 mb-1">{kat?.nama || '-'}</div>
                  <div className="font-medium mb-2 line-clamp-1">{b.nama}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-white/50">Stok: </span>
                      <span className="font-semibold">{b.stok}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg btn-ghost"><Edit2 size={13} /></button>
                      <button onClick={() => confirm('Hapus?') && api.deleteBarang(b.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Barang' : 'Tambah Barang'} size="lg">
        <div className="space-y-4">
          <div>
            <Label>Gambar Barang</Label>
            <ImageUpload value={form.gambar} onChange={(v) => setForm({ ...form, gambar: v })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Nama Barang</Label>
              <Input value={form.nama || ''} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.id_kat} onChange={(e) => setForm({ ...form, id_kat: Number(e.target.value) })}>
                {kategori.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </Select>
            </div>
            <div>
              <Label>Stok</Label>
              <Input type="number" value={form.stok ?? 0} onChange={(e) => setForm({ ...form, stok: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <option value="tersedia">Tersedia</option>
                <option value="habis">Habis</option>
                <option value="rusak">Rusak</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Deskripsi (Rich Text)</Label>
            <RichEditor value={form.deskripsi || ''} onChange={(v) => setForm({ ...form, deskripsi: v })} placeholder="Deskripsi barang..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
