import React from 'react';
import { api, useStore } from './store';
import { Layout, type PageKey } from './components/Layout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { KategoriPage } from './pages/Kategori';
import { BarangPage } from './pages/Barang';
import { PeminjamanPage } from './pages/Peminjaman';
import { AkunPage } from './pages/Akun';
import { LaporanPage } from './pages/Laporan';
import { PengaturanPage } from './pages/Pengaturan';
import { ProfilPage } from './pages/Profil';

export default function App() {
  const user = useStore(() => api.currentUser());
  const [page, setPage] = React.useState<PageKey>('dashboard');

  if (!user) return <LoginPage />;

  const render = () => {
    switch (page) {
      case 'dashboard':  return <DashboardPage />;
      case 'kategori':   return <KategoriPage />;
      case 'barang':     return <BarangPage />;
      case 'peminjaman': return <PeminjamanPage />;
      case 'akun':       return <AkunPage />;
      case 'laporan':    return <LaporanPage />;
      case 'pengaturan': return <PengaturanPage />;
      case 'profil':     return <ProfilPage />;
      default:           return <DashboardPage />;
    }
  };

  return (
    <Layout page={page} onNavigate={setPage}>
      {render()}
    </Layout>
  );
}
