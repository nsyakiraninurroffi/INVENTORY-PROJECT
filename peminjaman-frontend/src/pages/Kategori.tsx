import React from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, useStore } from '../store';
import { Card, PageHeader, Button, Modal, Input, Textarea, Label, EmptyState } from '../components/UI';
import type { Kategori } from '../types';

export function KategoriPage() {
  const kategori = useStore((s) => s.kategori);
  const barang = useStore((s) => s.barang);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Kategori | null>(null);
  const [form, setForm] = React.useState({ nama: '', deskripsi: '' });
  const [q, setQ] = React.useState('');
  const [selected, setSelected] = React.useState<number[]>([]);

  const filtered = kategori.filter((k) =>
    k.nama.toLowerCase().includes(q.toLowerCase()) || k.deskripsi.toLowerCase().includes(q.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ nama: '', deskripsi: '' }); setOpen(true); };
  const openEdit = (k: Kategori) => { setEditing(k); setForm({ nama: k.nama, deskripsi: k.deskripsi }); setOpen(true); };
  const save = () => {
    if (!form.nama.trim()) { toast.error('Nama kategori wajib diisi'); return; }
    api.saveKategori(editing ? { id: editing.id, ...form } : form);
    toast.success(editing ? 'Kategori diperbarui ✨' : 'Kategori ditambahkan 🎉');
    setOpen(false);
  };
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <PageHeader
        title="Kategori Barang"
        subtitle="Kelola kategori untuk pengelompokan inventaris"
        actions={
          <>
            {selected.length > 0 && (
              <Button variant="danger" onClick={() => { api.bulkDeleteKategori(selected); toast.success(`${selected.length} kategori dihapus`); setSelected([]); }}>
                <Trash2 size={14} /> Hapus ({selected.length})
              </Button>
            )}
            <Button onClick={openNew}><Plus size={16} /> Tambah Kategori</Button>
          </>
        }
      />

      <Card className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-white/40" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kategori..."
            className="input w-full pl-10 pr-3 py-2.5 rounded-xl text-sm"
          />
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="Belum ada kategori" desc="Tambahkan kategori pertama Anda." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-white/45 border-b border-white/10">
                <tr>
                  <th className="p-4 w-10"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((k) => k.id) : [])} /></th>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-center">Jumlah Barang</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => {
                  const count = barang.filter((b) => b.id_kat === k.id).length;
                  return (
                    <tr key={k.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4"><input type="checkbox" checked={selected.includes(k.id)} onChange={() => toggle(k.id)} /></td>
                      <td className="p-4 font-medium">{k.nama}</td>
                      <td className="p-4 text-white/60 max-w-md truncate">{k.deskripsi}</td>
                      <td className="p-4 text-center"><span className="badge bg-violet-500/15 text-violet-200 border-violet-400/30">{count}</span></td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(k)} className="p-2 rounded-lg btn-ghost"><Edit2 size={14} /></button>
                          <button onClick={() => { if (confirm('Hapus kategori?')) { api.deleteKategori(k.id); toast.success('Kategori dihapus'); } }} className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-300"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
        <div className="space-y-4">
          <div>
            <Label>Nama Kategori</Label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="cth: Elektronik" />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Textarea rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
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
