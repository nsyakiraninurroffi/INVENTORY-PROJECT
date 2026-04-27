import React from 'react';
import { Package, Tag, ArrowLeftRight, Users, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useStore } from '../store';
import { Card, PageHeader, Badge } from '../components/UI';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler);

// ✨ Selaraskan warna text chart dengan body text dashboard (dark slate-purple)
const CHART_TEXT = '#2d1b3d';
const CHART_TEXT_SOFT = 'rgba(45, 27, 61, 0.65)';
const CHART_GRID = 'rgba(168, 85, 247, 0.12)';

/** Smooth animated number counter (gen-z aesthetic micro-interaction) */
function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v).toLocaleString('id-ID'));
  React.useEffect(() => {
    const controls = animate(motionVal, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value]);
  return <motion.span>{rounded}</motion.span>;
}

export function DashboardPage() {
  const { barang, kategori, peminjaman, users } = useStore((s) => ({
    barang: s.barang, kategori: s.kategori, peminjaman: s.peminjaman, users: s.users,
  }));

  const totalStok = barang.reduce((a, b) => a + b.stok, 0);
  const aktif = peminjaman.filter((p) => p.status === 'aktif').length;

  // Bar: barang per kategori — soft pink/purple
  const barData = {
    labels: kategori.map((k) => k.nama),
    datasets: [{
      label: 'Jumlah Stok',
      data: kategori.map((k) => barang.filter((b) => b.id_kat === k.id).reduce((a, b) => a + b.stok, 0)),
      backgroundColor: 'rgba(217, 119, 232, 0.55)',
      borderRadius: 12,
      borderColor: 'rgba(168, 85, 247, 0.85)',
      borderWidth: 1.5,
      hoverBackgroundColor: 'rgba(236, 72, 153, 0.7)',
    }],
  };

  // Doughnut: status barang
  const statusCount = {
    tersedia: barang.filter((b) => b.status === 'tersedia').length,
    habis: barang.filter((b) => b.status === 'habis').length,
    rusak: barang.filter((b) => b.status === 'rusak').length,
  };
  const doughnutData = {
    labels: ['Tersedia', 'Habis', 'Rusak'],
    datasets: [{
      data: [statusCount.tersedia, statusCount.habis, statusCount.rusak],
      backgroundColor: [
        'rgba(52, 211, 153, 0.85)',   // green
        'rgba(251, 191, 36, 0.85)',   // amber
        'rgba(244, 63, 94, 0.85)',    // rose
      ],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  // Line: peminjaman per bulan
  const months = ['Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb'];
  const lineData = {
    labels: months,
    datasets: [{
      label: 'Transaksi Peminjaman',
      data: [4, 7, 6, 9, 12, peminjaman.length + 5],
      borderColor: 'rgba(168, 85, 247, 1)',
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'rgba(236, 72, 153, 0.15)';
        const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        grad.addColorStop(0, 'rgba(236, 72, 153, 0.35)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.02)');
        return grad;
      },
      fill: true,
      tension: 0.42,
      pointBackgroundColor: '#ec4899',
      pointBorderColor: '#fff',
      pointBorderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 3,
    }],
  };

  const chartOptions: any = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        labels: {
          color: CHART_TEXT,
          font: { size: 12, weight: '600', family: "'Plus Jakarta Sans', sans-serif" },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#2d1b3d',
        bodyColor: '#5b2870',
        borderColor: 'rgba(168, 85, 247, 0.25)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 12, weight: '700' },
        bodyFont: { size: 12, weight: '500' },
        displayColors: true,
        boxPadding: 6,
      },
    },
    scales: {
      x: { ticks: { color: CHART_TEXT_SOFT, font: { size: 11, weight: '500' } }, grid: { color: CHART_GRID, drawBorder: false } },
      y: { ticks: { color: CHART_TEXT_SOFT, font: { size: 11, weight: '500' } }, grid: { color: CHART_GRID, drawBorder: false }, beginAtZero: true },
    },
  };

  // Doughnut needs different legend position
  const doughnutOptions: any = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart', animateRotate: true, animateScale: true },
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: CHART_TEXT,
          font: { size: 12, weight: '600', family: "'Plus Jakarta Sans', sans-serif" },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: chartOptions.plugins.tooltip,
    },
  };

  const stats = [
    { l: 'Total Barang',      v: barang.length,    sub: `${totalStok} unit stok`, i: Package,        c: 'from-fuchsia-500 via-pink-500 to-rose-500',     glow: 'rgba(236,72,153,0.55)' },
    { l: 'Kategori',          v: kategori.length,  sub: 'Aktif',                  i: Tag,            c: 'from-violet-500 via-purple-500 to-fuchsia-500', glow: 'rgba(168,85,247,0.55)' },
    { l: 'Peminjaman Aktif',  v: aktif,            sub: `${peminjaman.length} total`, i: ArrowLeftRight, c: 'from-pink-500 via-rose-500 to-orange-400',   glow: 'rgba(244,114,182,0.55)' },
    { l: 'Pengguna',          v: users.length,     sub: 'Multi-role',             i: Users,          c: 'from-indigo-500 via-violet-500 to-purple-500',  glow: 'rgba(139,92,246,0.55)' },
  ];

  // Stagger container & item variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: any = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 220 } },
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas peminjaman barang"
        actions={
          <Badge color="green"><TrendingUp size={11} /> Sistem Online</Badge>
        }
      />

      {/* === Stats with stagger entrance === */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((s) => {
          const Icon = s.i;
          return (
            <motion.div
              key={s.l}
              variants={item}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
              className="group"
            >
              <Card className="relative overflow-hidden cursor-default">
                {/* Animated glow blob */}
                <motion.div
                  className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${s.c} opacity-25 blur-2xl`}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.32, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Sparkle on hover */}
                <motion.div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={12} style={{ color: '#ec4899' }} />
                </motion.div>

                <div className="flex items-start justify-between mb-3 relative">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.c} flex items-center justify-center relative`}
                    style={{ boxShadow: `0 8px 22px -6px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.4)` }}
                  >
                    <Icon size={19} strokeWidth={2.4} style={{ color: '#ffffff' }} />
                  </motion.div>
                </div>

                <div className="text-3xl font-bold tracking-tight" style={{ color: '#2d1b3d' }}>
                  <AnimatedNumber value={s.v} />
                </div>
                <div className="text-xs mt-1 font-medium" style={{ color: 'rgba(91, 40, 112, 0.65)' }}>
                  {s.l} · {s.sub}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* === Charts === */}
      <motion.div
        className="grid lg:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="lg:col-span-2 lift">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-base" style={{ color: '#2d1b3d' }}>Tren Peminjaman</div>
              <div className="text-xs font-medium" style={{ color: 'rgba(91, 40, 112, 0.6)' }}>6 bulan terakhir</div>
            </div>
            <Badge color="blue">Real-time</Badge>
          </div>
          <div className="h-64"><Line data={lineData} options={chartOptions} /></div>
        </Card>

        <Card className="lift">
          <div className="font-bold text-base" style={{ color: '#2d1b3d' }}>Status Barang</div>
          <div className="text-xs font-medium mb-4" style={{ color: 'rgba(91, 40, 112, 0.6)' }}>Distribusi kondisi inventaris</div>
          <div className="h-64"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
        </Card>
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="lg:col-span-2 lift">
          <div className="font-bold text-base" style={{ color: '#2d1b3d' }}>Stok per Kategori</div>
          <div className="text-xs font-medium mb-4" style={{ color: 'rgba(91, 40, 112, 0.6)' }}>Total unit barang yang tersedia</div>
          <div className="h-64"><Bar data={barData} options={chartOptions} /></div>
        </Card>

        <Card className="lift">
          <div className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: '#2d1b3d' }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AlertCircle size={16} style={{ color: '#f59e0b' }} />
            </motion.div>
            Stok Menipis
          </div>
          <div className="space-y-2">
            {barang.filter((b) => b.stok < 5).slice(0, 6).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/5 cursor-default"
              >
                <div className="text-sm truncate flex-1 min-w-0 font-medium" style={{ color: '#2d1b3d' }}>{b.nama}</div>
                <Badge color={b.stok === 0 ? 'red' : 'amber'}>{b.stok} unit</Badge>
              </motion.div>
            ))}
            {barang.filter((b) => b.stok < 5).length === 0 && (
              <div className="text-sm text-center py-4" style={{ color: 'rgba(91, 40, 112, 0.5)' }}>Semua stok aman ✨</div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
