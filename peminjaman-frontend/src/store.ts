import { useSyncExternalStore, useMemo } from 'react';
import type { User, Kategori, Barang, Peminjaman, AppConfig } from './types';

interface State {
  users: User[];
  kategori: Kategori[];
  barang: Barang[];
  peminjaman: Peminjaman[];
  config: AppConfig;
  currentUserId: number | null;
}

const STORAGE_KEY = 'sipinjam_state_v1';

const seed = (): State => ({
  config: {
    appName: 'SiPinjam',
    appTagline: 'Sistem Peminjaman Barang Modern',
    primaryColor: '#8b5cf6',
    maxPinjamHari: 7,
    dendaPerHari: 5000,
    alamat: 'Jl. Pendidikan No. 1, Indonesia',
  },
  currentUserId: null,
  users: [
    { id: 1, username: 'admin', password: 'admin', nama: 'Administrator', email: 'admin@sipinjam.id', role: 'admin', bio: 'Super admin sistem.', createdAt: '2025-01-10' },
    { id: 2, username: 'petugas', password: 'petugas', nama: 'Budi Petugas', email: 'budi@sipinjam.id', role: 'petugas', bio: 'Petugas inventaris lab.', createdAt: '2025-02-01' },
    { id: 3, username: 'siti', password: '123', nama: 'Nesya', email: 'siti@student.id', role: 'peminjam', bio: 'Mahasiswa Teknik Informatika.', createdAt: '2025-03-15' },
  ],
  kategori: [
    { id: 1, nama: 'Elektronik', deskripsi: 'Perangkat elektronik untuk lab & multimedia.' },
    { id: 2, nama: 'Olahraga', deskripsi: 'Peralatan olahraga indoor & outdoor.' },
    { id: 3, nama: 'Alat Tulis', deskripsi: 'Perlengkapan kerja & seminar.' },
    { id: 4, nama: 'Furniture', deskripsi: 'Meja, kursi, dan perlengkapan ruangan.' },
  ],
  barang: [
    { id: 1, nama: 'Proyektor Epson EB-S41', stok: 5, id_kat: 1, status: 'tersedia', deskripsi: '<p>Proyektor <strong>SVGA</strong> 3300 lumens, cocok untuk presentasi kelas.</p>' },
    { id: 2, nama: 'Laptop Asus Vivobook', stok: 3, id_kat: 1, status: 'tersedia', deskripsi: '<p>Laptop untuk peminjaman sementara mahasiswa.</p>' },
    { id: 3, nama: 'Bola Basket Molten', stok: 8, id_kat: 2, status: 'tersedia', deskripsi: '<p>Bola basket ukuran 7 standar pertandingan.</p>' },
    { id: 4, nama: 'Raket Badminton Yonex', stok: 0, id_kat: 2, status: 'habis', deskripsi: '<p>Raket profesional Yonex.</p>' },
    { id: 5, nama: 'Whiteboard Marker (set)', stok: 25, id_kat: 3, status: 'tersedia', deskripsi: '<p>Set spidol whiteboard 4 warna.</p>' },
    { id: 6, nama: 'Kursi Lipat', stok: 40, id_kat: 4, status: 'tersedia', deskripsi: '<p>Kursi lipat untuk acara seminar.</p>' },
    { id: 7, nama: 'Speaker Bluetooth JBL', stok: 2, id_kat: 1, status: 'tersedia', deskripsi: '<p>Speaker portable untuk acara.</p>' },
    { id: 8, nama: 'Microphone Wireless', stok: 4, id_kat: 1, status: 'tersedia', deskripsi: '<p>Mic wireless dual untuk presentasi.</p>' },
  ],
  peminjaman: [
    {
      id: 1, id_user: 3, nama_peminjam: 'Siti Nuraini', jumlah_item: 2,
      tgl_pinjam: '2026-01-05', tgl_kembali: '2026-01-12', status: 'selesai',
      catatan: 'Untuk kegiatan seminar HMTI.',
      details: [
        { id: 1, id_pinjam: 1, id_barang: 1, jumlah: 1, status: 'dikembalikan' },
        { id: 2, id_pinjam: 1, id_barang: 7, jumlah: 1, status: 'dikembalikan' },
      ],
    },
    {
      id: 2, id_user: 3, nama_peminjam: 'Siti Nuraini', jumlah_item: 3,
      tgl_pinjam: '2026-02-10', tgl_kembali: '2026-02-17', status: 'aktif',
      catatan: 'Peminjaman untuk pertandingan basket.',
      details: [
        { id: 3, id_pinjam: 2, id_barang: 3, jumlah: 3, status: 'dipinjam' },
      ],
    },
    {
      id: 3, id_user: 2, nama_peminjam: 'Budi Petugas', jumlah_item: 5,
      tgl_pinjam: '2026-02-15', tgl_kembali: '2026-02-22', status: 'aktif',
      catatan: 'Persiapan acara wisuda.',
      details: [
        { id: 4, id_pinjam: 3, id_barang: 6, jumlah: 4, status: 'dipinjam' },
        { id: 5, id_pinjam: 3, id_barang: 8, jumlah: 1, status: 'dipinjam' },
      ],
    },
  ],
});

let state: State = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = seed();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  return s;
})();

const listeners = new Set<() => void>();

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  set: (updater: (s: State) => State) => {
    state = updater({ ...state });
    emit();
  },
  reset: () => {
    state = seed();
    emit();
  },
};

export function useStore<T>(selector: (s: State) => T = ((s) => s as unknown as T)): T {
  // Subscribe to the FULL state (stable reference between updates) to avoid
  // returning a new object on every snapshot call, which would cause an
  // infinite re-render loop in useSyncExternalStore.
  const fullState = useSyncExternalStore(
    store.subscribe,
    store.get,
    store.get
  );
  // Recompute selected slice only when underlying state object changes.
  return useMemo(() => selector(fullState), [fullState]); // eslint-disable-line react-hooks/exhaustive-deps
}

// ---------- Helpers ----------
const nextId = (arr: { id: number }[]) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1);

export const api = {
  // Auth
  login: (username: string, password: string): User | null => {
    const u = state.users.find((u) => u.username === username && u.password === password);
    if (u) {
      store.set((s) => ({ ...s, currentUserId: u.id }));
      return u;
    }
    return null;
  },
  logout: () => store.set((s) => ({ ...s, currentUserId: null })),
  currentUser: (): User | null => state.users.find((u) => u.id === state.currentUserId) || null,

  // Users
  saveUser: (u: Partial<User> & { id?: number }) => {
    store.set((s) => {
      if (u.id) {
        return { ...s, users: s.users.map((x) => (x.id === u.id ? { ...x, ...u } as User : x)) };
      }
      const id = nextId(s.users);
      const newU: User = {
        id, username: u.username || '', password: u.password || '123', nama: u.nama || '',
        email: u.email || '', role: (u.role as any) || 'peminjam', avatar: u.avatar, bio: u.bio,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return { ...s, users: [...s.users, newU] };
    });
  },
  deleteUser: (id: number) => store.set((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) })),

  // Kategori
  saveKategori: (k: Partial<Kategori> & { id?: number }) => {
    store.set((s) => {
      if (k.id) return { ...s, kategori: s.kategori.map((x) => (x.id === k.id ? { ...x, ...k } as Kategori : x)) };
      const id = nextId(s.kategori);
      return { ...s, kategori: [...s.kategori, { id, nama: k.nama || '', deskripsi: k.deskripsi || '' }] };
    });
  },
  deleteKategori: (id: number) => store.set((s) => ({ ...s, kategori: s.kategori.filter((k) => k.id !== id) })),
  bulkDeleteKategori: (ids: number[]) =>
    store.set((s) => ({ ...s, kategori: s.kategori.filter((k) => !ids.includes(k.id)) })),

  // Barang
  saveBarang: (b: Partial<Barang> & { id?: number }) => {
    store.set((s) => {
      if (b.id) return { ...s, barang: s.barang.map((x) => (x.id === b.id ? { ...x, ...b } as Barang : x)) };
      const id = nextId(s.barang);
      const newB: Barang = {
        id, nama: b.nama || '', stok: b.stok || 0, id_kat: b.id_kat || 1,
        status: b.status || 'tersedia', gambar: b.gambar, deskripsi: b.deskripsi || '',
      };
      return { ...s, barang: [...s.barang, newB] };
    });
  },
  deleteBarang: (id: number) => store.set((s) => ({ ...s, barang: s.barang.filter((b) => b.id !== id) })),
  bulkDeleteBarang: (ids: number[]) =>
    store.set((s) => ({ ...s, barang: s.barang.filter((b) => !ids.includes(b.id)) })),

  // Peminjaman
  createPeminjaman: (p: {
    id_user: number; nama_peminjam: string; tgl_pinjam: string; tgl_kembali: string;
    catatan?: string; items: { id_barang: number; jumlah: number }[];
  }) => {
    store.set((s) => {
      const id = nextId(s.peminjaman);
      const detailsStart = s.peminjaman.flatMap((x) => x.details).length + 1;
      const details = p.items.map((it, idx) => ({
        id: detailsStart + idx, id_pinjam: id, id_barang: it.id_barang,
        jumlah: it.jumlah, status: 'dipinjam' as const,
      }));
      // kurangi stok
      const barang = s.barang.map((b) => {
        const used = p.items.find((it) => it.id_barang === b.id);
        if (!used) return b;
        const newStok = Math.max(0, b.stok - used.jumlah);
        return { ...b, stok: newStok, status: newStok === 0 ? 'habis' as const : b.status };
      });
      const newP: Peminjaman = {
        id, id_user: p.id_user, nama_peminjam: p.nama_peminjam,
        jumlah_item: p.items.reduce((a, b) => a + b.jumlah, 0),
        tgl_pinjam: p.tgl_pinjam, tgl_kembali: p.tgl_kembali, status: 'aktif',
        details, catatan: p.catatan,
      };
      return { ...s, peminjaman: [newP, ...s.peminjaman], barang };
    });
  },
  kembalikan: (id_pinjam: number) => {
    store.set((s) => {
      const p = s.peminjaman.find((x) => x.id === id_pinjam);
      if (!p) return s;
      // kembalikan stok
      const barang = s.barang.map((b) => {
        const det = p.details.find((d) => d.id_barang === b.id && d.status === 'dipinjam');
        if (!det) return b;
        return { ...b, stok: b.stok + det.jumlah, status: 'tersedia' as const };
      });
      const peminjaman = s.peminjaman.map((x) =>
        x.id === id_pinjam
          ? { ...x, status: 'selesai' as const, details: x.details.map((d) => ({ ...d, status: 'dikembalikan' as const })) }
          : x
      );
      return { ...s, barang, peminjaman };
    });
  },
  deletePeminjaman: (id: number) => store.set((s) => ({ ...s, peminjaman: s.peminjaman.filter((p) => p.id !== id) })),

  // Config
  saveConfig: (c: Partial<AppConfig>) => store.set((s) => ({ ...s, config: { ...s.config, ...c } })),
};
