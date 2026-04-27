import React from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { api, store, useStore } from '../store';
import { Card, PageHeader, Button, Input, Label } from '../components/UI';

export function PengaturanPage() {
  const config = useStore((s) => s.config);
  const [form, setForm] = React.useState(config);

  React.useEffect(() => setForm(config), [config]);

  const save = () => api.saveConfig(form);
  const reset = () => {
    if (confirm('Reset semua data sistem ke seed awal?')) {
      store.reset();
      window.location.reload();
    }
  };

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Konfigurasi dinamis aplikasi" />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="font-semibold mb-1">Identitas Aplikasi</div>
          <div className="text-xs text-white/50 mb-5">Disimpan ke tabel <code className="text-violet-300">app_settings</code></div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Nama Aplikasi</Label>
              <Input value={form.appName} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input value={form.appTagline} onChange={(e) => setForm({ ...form, appTagline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Alamat</Label>
              <Input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
            </div>
            <div>
              <Label>Maksimal Hari Pinjam</Label>
              <Input type="number" value={form.maxPinjamHari} onChange={(e) => setForm({ ...form, maxPinjamHari: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Denda per Hari (Rp)</Label>
              <Input type="number" value={form.dendaPerHari} onChange={(e) => setForm({ ...form, dendaPerHari: Number(e.target.value) })} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5 pt-5 border-t border-white/10">
            <Button onClick={save}><Save size={14} /> Simpan</Button>
          </div>
        </Card>

        <Card>
          <div className="font-semibold mb-1">Zona Berbahaya</div>
          <div className="text-xs text-white/50 mb-5">Tindakan ini tidak dapat dibatalkan.</div>
          <Button variant="danger" onClick={reset} className="w-full">
            <RotateCcw size={14} /> Reset Seed Database
          </Button>
          <p className="text-xs text-white/40 mt-3">
            Akan menjalankan ulang semua seeder & migration ke data awal.
          </p>
        </Card>
      </div>
    </div>
  );
}
