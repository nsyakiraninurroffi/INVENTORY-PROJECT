import React from 'react';
import { Plus, Edit2, Trash2, Search, Shield, User as UserIcon, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, useStore } from '../store';
import { Card, PageHeader, Button, Modal, Input, Select, Textarea, Label, EmptyState, ImageUpload } from '../components/UI';
import type { User } from '../types';

// Gradient pills for each role with WHITE icons (gen-z elegant)
const ROLE_STYLE: Record<string, { bg: string; glow: string; icon: any; label: string }> = {
  admin:    { bg: 'linear-gradient(135deg,#a855f7,#7c3aed)', glow: 'rgba(168,85,247,0.45)', icon: Shield,    label: 'Admin' },
  petugas:  { bg: 'linear-gradient(135deg,#0ea5e9,#6366f1)', glow: 'rgba(14,165,233,0.45)', icon: Briefcase, label: 'Petugas' },
  peminjam: { bg: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,0.45)', icon: UserIcon,  label: 'Peminjam' },
};

function RolePill({ role }: { role: string }) {
  const s = ROLE_STYLE[role] || ROLE_STYLE.peminjam;
  const Icon = s.icon;
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
      style={{
        background: s.bg,
        color: '#ffffff',
        boxShadow: `0 4px 12px -4px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
    >
      <Icon size={11} strokeWidth={2.6} style={{ color: '#ffffff' }} />
      <span style={{ color: '#ffffff' }}>{s.label}</span>
    </motion.span>
  );
}

export function AkunPage() {
  const users = useStore((s) => s.users);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<User | null>(null);
  const [form, setForm] = React.useState<Partial<User>>({});
  const [q, setQ] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('');

  const filtered = users.filter((u) => {
    const okQ = u.username.toLowerCase().includes(q.toLowerCase()) || u.nama.toLowerCase().includes(q.toLowerCase());
    return okQ && (!filterRole || u.role === filterRole);
  });

  const openNew = () => {
    setEditing(null);
    setForm({ username: '', password: '', nama: '', email: '', role: 'peminjam', bio: '' });
    setOpen(true);
  };
  const openEdit = (u: User) => { setEditing(u); setForm({ ...u }); setOpen(true); };
  const save = () => {
    if (!form.username?.trim() || !form.nama?.trim()) return;
    api.saveUser(editing ? { ...form, id: editing.id } : form);
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Akun"
        subtitle="Multi akun dengan profil kustom & kontrol role"
        actions={<Button onClick={openNew}><Plus size={16} /> Tambah Akun</Button>}
      />

      <Card className="mb-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari user..." className="input w-full pl-10 pr-3 py-2.5 rounded-xl text-sm" />
          </div>
          <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="petugas">Petugas</option>
            <option value="peminjam">Peminjam</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState title="Tidak ada user" /></Card>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
        >
          {filtered.map((u) => (
            <motion.div
              key={u.id}
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 220 } } } as any}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
            >
            <Card>
              <div className="flex items-start gap-3">
                {u.avatar ? (
                  <img src={u.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-200/60" />
                ) : (
                  <motion.div
                    whileHover={{ rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0"
                    style={{
                      background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
                      color: '#ffffff',
                      boxShadow: '0 8px 20px -6px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.35)',
                    }}>
                    <span style={{ color: '#ffffff' }}>{u.nama.charAt(0)}</span>
                  </motion.div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{u.nama}</div>
                  <div className="text-xs text-white/45">@{u.username}</div>
                  <div className="mt-2"><RolePill role={u.role} /></div>
                </div>
              </div>
              {u.bio && <div className="text-xs text-white/55 mt-3 line-clamp-2">{u.bio}</div>}
              <div className="text-xs text-white/40 mt-3">{u.email}</div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-white/5">
                <button onClick={() => openEdit(u)} className="flex-1 btn-ghost rounded-lg px-2 py-1.5 text-xs flex items-center justify-center gap-1">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => confirm('Hapus user?') && api.deleteUser(u.id)} className="px-3 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300">
                  <Trash2 size={12} />
                </button>
              </div>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Akun' : 'Tambah Akun'} size="lg">
        <div className="space-y-4">
          <div>
            <Label>Avatar</Label>
            <ImageUpload value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Nama Lengkap</Label>
              <Input value={form.nama || ''} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Username</Label>
              <Input value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="text" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Role</Label>
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                <option value="admin">Admin</option>
                <option value="petugas">Petugas</option>
                <option value="peminjam">Peminjam</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Bio</Label>
              <Textarea rows={3} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
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
