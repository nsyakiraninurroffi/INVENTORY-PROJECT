import React from 'react';
import { Sparkles, Lock, User as UserIcon, ArrowRight, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api, useStore } from '../store';

export function LoginPage() {
  const config = useStore((s) => s.config);
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('admin');
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const u = api.login(username, password);
      if (!u) toast.error('Username atau password salah ✗');
      else toast.success(`Halo ${u.nama}! 🌸`);
      setLoading(false);
    }, 350);
  };

  return (
    <div className="bg-aurora min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="blob-deco animate-blob" style={{ top: '-100px', left: '-50px', width: '380px', height: '380px', background: '#f9a8d4' }} />
      <div className="blob-deco animate-blob" style={{ bottom: '-120px', right: '-50px', width: '420px', height: '420px', background: '#c4b5fd', animationDelay: '3s' }} />
      <div className="blob-deco animate-blob" style={{ top: '40%', left: '50%', width: '300px', height: '300px', background: '#a5f3fc', animationDelay: '6s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center z-10"
      >
        {/* Left - branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="hidden lg:block"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles size={14} className="text-pink-500" />
            <span className="text-xs font-semibold text-purple-700">Laravel · React · MySQL · ChartJS</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] mb-5 tracking-tight">
            Kelola peminjaman barang dengan{' '}
            <span className="gradient-text">cantik & cerdas</span> ✨
          </h1>
          <p className="text-purple-700/70 text-lg mb-8 max-w-md leading-relaxed">
            {config.appTagline}. Lacak inventaris, transaksi pinjam-kembali, hingga laporan—semua dalam satu dashboard yang aesthetic.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {[
              { l: 'CRUD lengkap',     d: 'Kategori, barang, akun', icon: '📦' },
              { l: 'Transaksi pinjam', d: 'Multi-item, atomic',     icon: '🔄' },
              { l: 'Laporan & Chart',  d: 'Visualisasi real-time',  icon: '📊' },
              { l: 'Export Excel/PDF', d: 'Sekali klik',            icon: '📤' },
            ].map((f, i) => (
              <motion.div
                key={f.l}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-3.5 lift"
              >
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-sm font-bold text-purple-900">{f.l}</div>
                <div className="text-xs text-purple-700/65">{f.d}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - login form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="glass-strong rounded-[28px] p-8 sm:p-10 w-full relative overflow-hidden"
        >
          {/* sparkles deco */}
          <Heart size={14} className="absolute top-6 right-8 text-pink-300 animate-pulse-soft" fill="currentColor" />
          <Star size={12} className="absolute top-12 right-16 text-violet-300 animate-pulse-soft" fill="currentColor" style={{ animationDelay: '1s' }} />

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300/40"
              style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">{config.appName}</span>
          </div>

          <h2 className="text-3xl font-extrabold mb-1.5 gradient-text">Welcome back!</h2>
          <p className="text-sm text-purple-700/65 mb-7">Yuk login ke akun kamu 💕</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-purple-800/75 mb-1.5 block uppercase tracking-wide">Username</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3.5 top-3.5 text-pink-400" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input w-full pl-10 pr-3 py-3 rounded-xl text-sm"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-800/75 mb-1.5 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-pink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-10 pr-3 py-3 rounded-xl text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ripple"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memuat...
                </span>
              ) : (
                <>Masuk Sekarang <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-7 pt-6 border-t border-purple-200/50">
            <div className="text-[11px] font-bold text-purple-700/65 mb-3 uppercase tracking-wider text-center">Demo Akun</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { u: 'admin',   p: 'admin',   role: 'Admin',    color: 'from-pink-400 to-rose-400' },
                { u: 'petugas', p: 'petugas', role: 'Petugas',  color: 'from-violet-400 to-purple-500' },
                { u: 'siti',    p: '123',     role: 'Peminjam', color: 'from-sky-400 to-blue-500' },
              ].map((d) => (
                <button
                  key={d.u}
                  type="button"
                  onClick={() => { setUsername(d.u); setPassword(d.p); }}
                  className="text-left p-2.5 rounded-xl border border-purple-200/60 hover:border-pink-300 hover:bg-pink-50/60 transition group"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${d.color} mb-1.5 group-hover:scale-110 transition-transform`} />
                  <div className="text-[11px] font-bold text-purple-900">{d.role}</div>
                  <div className="text-[10px] text-purple-600/70 font-mono">{d.u}/{d.p}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
