export type Role = 'admin' | 'petugas' | 'peminjam';

export interface User {
  id: number;
  username: string;
  password: string;
  nama: string;
  email: string;
  role: Role;
  avatar?: string; // base64
  bio?: string;
  createdAt: string;
}

export interface Kategori {
  id: number;
  nama: string;
  deskripsi: string;
}

export interface Barang {
  id: number;
  nama: string;
  stok: number;
  id_kat: number;
  status: 'tersedia' | 'habis' | 'rusak';
  gambar?: string; // base64
  deskripsi?: string; // rich text HTML
}

export interface DetailPeminjaman {
  id: number;
  id_pinjam: number;
  id_barang: number;
  jumlah: number;
  status: 'dipinjam' | 'dikembalikan';
}

export interface Peminjaman {
  id: number;
  id_user: number;
  nama_peminjam: string;
  jumlah_item: number;
  tgl_pinjam: string;
  tgl_kembali: string;
  status: 'aktif' | 'selesai' | 'terlambat';
  details: DetailPeminjaman[];
  catatan?: string;
}

export interface AppConfig {
  appName: string;
  appTagline: string;
  primaryColor: string;
  maxPinjamHari: number;
  dendaPerHari: number;
  alamat: string;
}
