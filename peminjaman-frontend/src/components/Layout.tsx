import React from 'react';
import {
  LayoutDashboard, Tag, Package, ArrowLeftRight, Users, BarChart3,
  Settings, LogOut, Menu, X, Sparkles, Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { api, useStore } from '../store';

export type PageKey =
  | 'dashboard' | 'kategori' | 'barang' | 'peminjaman'
  | 'akun' | 'laporan' | 'pengaturan' | 'profil';

const NAV: { key: PageKey; label: string; icon: any; roles?: string[]; group?: string }[] = [
  { key: 'dashboard',   label: 'Dashboard',     icon: LayoutDashboard, group: 'Utama' },
  { key: 'kategori',    label: 'Kategori',      icon: Tag,             roles: ['admin', 'petugas'], group: 'Manajemen' },
  { key: 'barang',      label: 'Barang',        icon: Package,         roles: ['admin', 'petugas'], group: 'Manajemen' },
  { key: 'peminjaman',  label: 'Peminjaman',    icon: ArrowLeftRight,  group: 'Transaksi' },
  { key: 'laporan',     label: 'Laporan',       icon: BarChart3,       roles: ['admin', 'petugas'], group: 'Transaksi' },
  { key: 'akun',        label: 'Akun',          icon: Users,           roles: ['admin'], group: 'Sistem' },
  { key: 'pengaturan',  label: 'Pengaturan',    icon: Settings,        roles: ['admin'], group: 'Sistem' },
];

export function Layout({
  page, onNavigate, children,
}: { page: PageKey; onNavigate: (p: PageKey) => void; children: React.ReactNode }) {
  const config = useStore((s) => s.config);
  const user = useStore(() => api.currentUser());
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const items = NAV.filter((n) => !n.roles || (user && n.roles.includes(user.role)));

  return (
    <div className="bg-aurora min-h-screen relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="blob-deco animate-blob" style={{ top: '-100px', left: '-80px', width: '320px', height: '320px', background: '#f9a8d4' }} />
      <div className="blob-deco animate-blob" style={{ bottom: '-120px', right: '-100px', width: '380px', height: '380px', background: '#c4b5fd', animationDelay: '4s' }} />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.95)',
            color: '#5b2870',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 30px -10px rgba(168, 85, 247, 0.35)',
          },
        }}
      />

      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-pink-200/50 relative">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold gradient-text">{config.appName}</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl btn-ghost"><Menu size={18} /></button>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col p-4 sticky top-0 h-screen">
          <div className="glass rounded-3xl flex-1 flex flex-col p-4">
            <SidebarContent items={items} page={page} onNavigate={onNavigate} user={user} config={config} />
          </div>
        </aside>

        {/* Sidebar mobile */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 z-50 flex"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
              <motion.aside
                className="relative w-72 max-w-[85%] glass-strong p-4 flex flex-col rounded-r-3xl"
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              >
                <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-lg btn-ghost"><X size={16} /></button>
                <SidebarContent items={items} page={page} onNavigate={(p: PageKey) => { onNavigate(p); setMobileOpen(false); }} user={user} config={config} />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <motion.div
      whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.08 }}
      transition={{ duration: 0.6 }}
      className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300/50 animate-pulse-soft relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7,#8b5cf6)' }}
    >
      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)' }}
        animate={{ x: ['-120%', '120%'] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
      />
      <Sparkles size={17} strokeWidth={2.4} style={{ color: '#ffffff', position: 'relative', zIndex: 1 }} />
    </motion.div>
  );
}

function SidebarContent({
  items, page, onNavigate, user, config,
}: any) {
  // group by 'group'
  const groups: Record<string, any[]> = {};
  items.forEach((it: any) => {
    const g = it.group || 'Lainnya';
    if (!groups[g]) groups[g] = [];
    groups[g].push(it);
  });

  return (
    <>
      <div className="flex items-center gap-2.5 px-2 mb-6 mt-1">
        <Logo />
        <div>
          <div className="font-bold leading-tight gradient-text text-[15px]">{config.appName}</div>
          <div className="text-[10px] text-purple-700/60 uppercase tracking-wider font-semibold mt-0.5">Laravel · React · MySQL</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto -mr-2 pr-2">
        {Object.entries(groups).map(([groupName, list]) => (
          <div key={groupName} className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500/60 px-3 mb-1.5">{groupName}</div>
            {list.map((it: any) => {
              const Icon = it.icon;
              const active = page === it.key;
              return (
                <motion.button
                  key={it.key}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate(it.key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition relative w-full ${
                    active ? 'nav-active' : 'text-purple-900/70 hover:text-purple-900 hover:bg-white/60'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-pink-500' : 'text-purple-400'} />
                  <span className="flex-1 text-left">{it.label}</span>
                  {active && (
                    <motion.div
                      layoutId="active-dot"
                      className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </nav>

      {user && (
        <div className="mt-2 pt-3 border-t border-purple-200/50">
          <button onClick={() => onNavigate('profil')} className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/60 transition group">
            {user.avatar ? (
              <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-200" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md shadow-pink-300/40"
                style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                {user.nama.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-semibold truncate text-purple-900">{user.nama}</div>
              <div className="text-[10px] text-pink-600/80 uppercase font-bold tracking-wider">{user.role}</div>
            </div>
            <Bell size={14} className="text-purple-400 group-hover:text-pink-500 transition" />
          </button>
          <button onClick={() => api.logout()} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-white hover:bg-rose-500 transition">
            <LogOut size={13} /> Keluar
          </button>
        </div>
      )}
    </>
  );
}
