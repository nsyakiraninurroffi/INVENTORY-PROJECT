𝖲𝗂𝖯𝗂𝗇𝗃𝖺𝗆 — 𝖲𝗆𝖺𝗋𝗍 𝖨𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 & 𝖫𝖾𝗇𝖽𝗂𝗇𝗀 𝖲𝗒𝗌𝗍𝖾𝗆

> *Modern, elegant, and aesthetic web-based system for managing item borrowing seamlessly.*
⫘⫘⫘⫘⫘⫘
![Banner](https://img.shields.io/badge/Laravel-12-red?style=for-the-badge\&logo=laravel)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge\&logo=react)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge\&logo=mysql)
![Status](https://img.shields.io/badge/Status-Development-green?style=for-the-badge)

---

## ✨ Overview

**SiPinjam** adalah sistem peminjaman barang berbasis web yang dirancang untuk membantu pengelolaan inventaris dan transaksi peminjaman secara digital, cepat, dan efisien.

Dibuat dengan pendekatan **modern UI + real-time data + clean architecture**, project ini cocok digunakan untuk:

* Sekolah 🏫
* Kantor 🏢
* Organisasi 📦

---

## 🎯 Goals

* Mengganti sistem manual → digital
* Meminimalisir kehilangan barang
* Mempermudah tracking peminjaman
* Menyediakan laporan otomatis

---

## 🚀 Tech Stack

### 🔹 Frontend

* React 19 + TypeScript
* Vite ⚡
* Framer Motion (smooth animation)
* Chart.js (data visualization)
* Custom CSS (aesthetic UI)

### 🔹 Backend

* Laravel 12 (PHP 8+)
* Eloquent ORM
* REST API
* Authentication System

### 🔹 Database

* MySQL

### 🔹 Export Tools

* jsPDF (PDF)
* SheetJS (Excel)

---

## 🔐 Role System (RBAC)

| Role        | Access                                  |
| ----------- | --------------------------------------- |
| 👑 Admin    | Full access (CRUD + laporan + settings) |
| 🛠️ Petugas | Kelola barang & transaksi               |
| 🙋 Peminjam | Pinjam barang & kelola profil           |

---

## 🧩 Core Features

### 📦 Inventory Management

* CRUD Kategori
* CRUD Barang
* Upload Gambar
* Rich Text Editor
* Status Barang (Tersedia / Habis / Rusak)

### 🔄 Peminjaman System

* Multi-item borrowing
* Auto stok berkurang
* Pengembalian otomatis
* Status tracking

### 📊 Dashboard Analytics

* Statistik real-time
* Chart visualisasi
* Barang stok menipis alert

### 📑 Laporan

* Filter berdasarkan tanggal
* Export ke:

  * Excel (.xlsx)
  * PDF

### 👤 User System

* Multi-role authentication
* Profile customization
* Avatar upload

### ⚙️ Settings

* Konfigurasi aplikasi
* Denda & max pinjam
* Reset database

---

## 🗄️ Database Structure

```bash
users
kategori
barang
peminjaman
detail_peminjaman
app_settings
```

Relasi utama:

* kategori → barang (1:N)
* peminjaman → detail (1:N)
* barang → detail (N:M via detail)

---

## 🎨 UI/UX Concept

✨ Style yang digunakan:

* Glassmorphism
* Gradient pink-purple
* Clean & modern layout
* Smooth animation
* Responsive design

> Professional ✔️
> Elegant ✔️
> Girly aesthetic ✔️
> Not alay ✔️

---

## 📸 Preview Features

### 🔐 Login Page

* Modern UI
* Gradient button
* Demo akun

### 📊 Dashboard

* Statistik cards
* Line chart
* Doughnut chart
* Bar chart

### 📦 Barang

* Grid card layout
* Filter & search
* Upload image

### 🔄 Peminjaman

* Multi-item
* Status badge
* Auto stok system

### 📑 Laporan

* Filter tanggal
* Export PDF & Excel

---

## ⚙️ Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/username/sipinjam.git
cd sipinjam
```

### 2. Backend Setup (Laravel)

```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup

Edit `.env`:

```env
DB_DATABASE=peminjaman_barang
DB_USERNAME=root
DB_PASSWORD=
```

Lalu:

```bash
php artisan migrate --seed
```

### 4. Run Server

```bash
php artisan serve
```

---

## 🔥 Default Accounts (Seeder)

| Role     | Email                                       | Password |
| -------- | ------------------------------------------- | -------- |
| Admin    | [admin@mail.com](mailto:admin@mail.com)     | password |
| Petugas  | [petugas@mail.com](mailto:petugas@mail.com) | password |
| Peminjam | [user@mail.com](mailto:user@mail.com)       | password |

---

## 📊 Project Status

| Feature    | Status               |
| ---------- | -------------------- |
| Templating | ✅                    |
| Migration  | ✅                    |
| Seeder     | ✅                    |
| CRUD       | ✅                    |
| Transaksi  | ✅                    |
| Auth       | ✅                    |
| Dashboard  | ✅                    |
| Laporan    | ⚠️ (ongoing upgrade) |

---

## 💡 Future Improvements

* API full integration (React ↔ Laravel)
* Notifikasi real-time 🔔
* Dark mode 🌙
* Mobile app version 📱
* QR Code scanning 📷

---

## 🏆 Why This Project?

✔ Real-world use case
✔ Fullstack implementation
✔ Clean UI & UX
✔ Ready for portfolio
✔ Scalable architecture

---

## 👩‍💻 Author

**Nesya Kirani Nurroffi**
💻 PPLG Student — SMKN 1 Cianjur

> “Code with logic, design with feeling.” 💖

---

## ⭐ Support

Kalau project ini membantu:

* ⭐ Star repo ini
* 🍴 Fork untuk belajar
* 💬 Share ke teman

---

## 📌 Closing

**SiPinjam bukan cuma project, tapi solusi.**
Dari manual → digital. Dari ribet → simpel.

---
