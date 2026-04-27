import React from 'react';
import { Save } from 'lucide-react';
import { api, useStore } from '../store';
import { Card, PageHeader, Button, Input, Label, Textarea, Badge, ImageUpload } from '../components/UI';

export function ProfilPage() {
  const user = useStore(() => api.currentUser());
  const allUsers = useStore((s) => s.users);
  const [form, setForm] = React.useState({ ...user! });

  React.useEffect(() => { if (user) setForm({ ...user }); }, [user?.id]);

  if (!user) return null;

  const save = () => {
    const uname = (form.username || '').trim();
    if (!uname) {
      alert('Username tidak boleh kosong!');
      return;
    }
    // Cek apakah username sudah dipakai user lain
    const dipakai = allUsers.some(
      (u) => u.id !== form.id && u.username.toLowerCase() === uname.toLowerCase()
    );
    if (dipakai) {
      alert('Username sudah dipakai user lain. Silakan pilih yang lain.');
      return;
    }
    api.saveUser({ ...form, username: uname });
    alert('Profil tersimpan!');
  };

  return (
    <div>
      <PageHeader title="Profil Saya" subtitle="Kelola informasi & preferensi akun Anda" />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="text-center">
          {form.avatar ? (
            <img src={form.avatar} className="w-28 h-28 rounded-3xl object-cover mx-auto" />
          ) : (
            <div className="w-28 h-28 rounded-3xl mx-auto flex items-center justify-center text-4xl font-semibold"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
              {form.nama.charAt(0)}
            </div>
          )}
          <div className="mt-4 font-semibold text-lg">{form.nama}</div>
          <div className="text-sm text-white/50">@{form.username}</div>
          <div className="mt-2"><Badge color="violet">{form.role}</Badge></div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <ImageUpload value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="font-semibold mb-4">Informasi Profil</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Nama</Label>
              <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username unik untuk login"
              />
            </div>
            <div>
              <Label>Password Baru</Label>
              <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Bio</Label>
              <Textarea rows={4} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <Button onClick={save}><Save size={14} /> Simpan Perubahan</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
