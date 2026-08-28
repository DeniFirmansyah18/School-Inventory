<h1 align="center">
  <img src="https://img.icons8.com/fluency/96/school.png" alt="Sekolah Inventory Logo" width="80"/>
  <br/>
  Sekolah Inventory
</h1>

<p align="center">
  Sistem manajemen inventaris sekolah berbasis web yang modern, responsif, dan berbasis peran (role-based).
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white" alt="Next.js 15"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white" alt="React 19"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5"/></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/></a>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

---

## 📖 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Arsitektur Proyek](#-arsitektur-proyek)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi & Konfigurasi](#-instalasi--konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Direktori](#-struktur-direktori)
- [Peran Pengguna (Role)](#-peran-pengguna-role)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [Lisensi](#-lisensi)

---

## 🏫 Tentang Proyek

**Sekolah Inventory** adalah aplikasi web manajemen inventaris yang dirancang khusus untuk lingkungan sekolah. Aplikasi ini memungkinkan pengelolaan data barang secara terpusat, mulai dari pencatatan aset, pemantauan status barang, hingga pembuatan laporan dalam berbagai format.

Dibangun dengan **Next.js 15** dan **Firebase Firestore** sebagai backend real-time, aplikasi ini menawarkan pengalaman yang cepat, responsif, dan aman dengan sistem autentikasi berbasis peran (Admin & User).

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🔐 **Autentikasi Aman** | Login & registrasi dengan proteksi rute berbasis peran (Admin / User) |
| 📦 **Manajemen Inventaris** | Tambah, ubah, hapus, dan lihat data barang secara lengkap |
| 🔍 **Pencarian & Filter** | Cari barang berdasarkan jenis, merk/tipe, atau sub jenis secara instan |
| 📊 **Dashboard Admin** | Ringkasan statistik: total nilai, total barang, barang aktif, dan grafik pengadaan per tahun |
| 📥 **Import Data (Excel)** | Impor data inventaris massal dari file `.xlsx` / `.xls` |
| 📤 **Export Laporan** | Unduh laporan dalam format **CSV**, **Excel (.xlsx)**, atau **PDF** |
| 🗂️ **Filter Laporan** | Filter laporan berdasarkan status barang (aktif/dihapus) dan rentang tanggal pengadaan |
| 📱 **Responsif** | Tampilan optimal di desktop, tablet, dan perangkat mobile |
| 🖥️ **Desktop App (Electron)** | Dapat dijalankan sebagai aplikasi desktop lintas platform (Windows, macOS, Linux) |

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **[Next.js 15](https://nextjs.org/)** — React Framework dengan App Router dan Turbopack
- **[React 19](https://react.dev/)** — UI Library
- **[TypeScript 5](https://www.typescriptlang.org/)** — Static typing untuk keamanan kode
- **[Tailwind CSS 3](https://tailwindcss.com/)** — Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Komponen UI berbasis Radix UI
- **[Lucide React](https://lucide.dev/)** — Icon library

### Backend & Database
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** — Real-time NoSQL database
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** — Autentikasi pengguna
- **[MongoDB / Mongoose](https://mongoosejs.com/)** — Opsional untuk skenario tertentu

### Data & Laporan
- **[TanStack Table v8](https://tanstack.com/table/latest)** — Tabel data yang powerful (sorting, filtering, pagination)
- **[SheetJS (xlsx)](https://sheetjs.com/)** — Import/export data Excel
- **[jsPDF](https://github.com/parallax/jsPDF)** — Generasi laporan PDF
- **[Recharts](https://recharts.org/)** — Visualisasi data/chart
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — Form management & validasi schema

### Desktop
- **[Electron 38](https://www.electronjs.org/)** — Packaging sebagai aplikasi desktop native

### Deployment
- **[Firebase App Hosting](https://firebase.google.com/docs/app-hosting)** — Cloud deployment

---

## 🏗️ Arsitektur Proyek

Aplikasi ini menggunakan **Next.js App Router** dengan struktur route group:

```
/                   → Redirect ke /login atau /dashboard
/login              → Halaman autentikasi
/register           → Halaman registrasi pengguna baru
/dashboard          → Dashboard statistik (Admin only)
/inventory          → Manajemen data inventaris (Admin & User)
/laporan            → Pembuatan & unduhan laporan (Admin only)
```

Data di-_stream_ secara real-time dari **Firebase Firestore** menggunakan `onSnapshot` listener, sehingga perubahan data langsung tercermin di UI tanpa perlu refresh halaman.

---

## 💻 Persyaratan Sistem

- **Node.js** >= 18.x
- **npm** >= 9.x atau **bun** >= 1.x
- Akun **Firebase** (untuk Firestore & Authentication)
- Browser modern (Chrome, Edge, Firefox)

---

## ⚙️ Instalasi & Konfigurasi

### 1. Clone Repository

```bash
git clone https://github.com/DeniFirmansyah18/School-Inventory.git
cd School-Inventory
```

### 2. Install Dependensi

```bash
npm install
# atau dengan bun
bun install
```

### 3. Konfigurasi Firebase

Buat project di [Firebase Console](https://console.firebase.google.com/), aktifkan **Firestore Database** dan **Authentication** (Email/Password).

Buat file `.env.local` di root project dan isi dengan konfigurasi Firebase Anda:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **⚠️ Penting:** Jangan pernah mengekspos file `.env.local` ke publik. File ini sudah terdaftar di `.gitignore`.

### 4. Aturan Keamanan Firestore

Pastikan aturan Firestore Anda sudah dikonfigurasi dengan benar di Firebase Console untuk membatasi akses data.

---

## 🚀 Menjalankan Aplikasi

### Mode Development (Web)

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:9002`

### Mode Production (Build & Start)

```bash
npm run build
npm run start
```

### Mode Desktop (Electron)

```bash
npm run electron
```

> Perintah ini akan menjalankan dev server dan membuka jendela Electron secara bersamaan.

### Build Installer Desktop

```bash
npm run electron-pack
```

Menghasilkan installer di folder `dist/` untuk platform yang sesuai (`.exe` untuk Windows, `.dmg` untuk macOS, `.AppImage` untuk Linux).

---

## 📁 Struktur Direktori

```
School-Inventory/
├── docs/                    # Dokumentasi proyek
│   └── blueprint.md         # Desain & panduan gaya aplikasi
├── src/
│   ├── ai/                  # Konfigurasi Genkit AI (jika digunakan)
│   ├── app/
│   │   ├── (main)/          # Route grup utama (authenticated)
│   │   │   ├── dashboard/   # Halaman dashboard admin
│   │   │   ├── inventory/   # Halaman manajemen inventaris
│   │   │   │   ├── columns.tsx          # Definisi kolom tabel
│   │   │   │   ├── inventory-detail.tsx # Komponen detail barang
│   │   │   │   ├── inventory-form.tsx   # Form tambah/ubah barang
│   │   │   │   ├── inventory-table.tsx  # Tabel utama inventaris
│   │   │   │   └── page.tsx
│   │   │   ├── laporan/     # Halaman pembuatan laporan
│   │   │   └── layout.tsx   # Layout utama (sidebar + header)
│   │   ├── api/             # API Routes Next.js
│   │   │   ├── inventory/   # Endpoint inventaris
│   │   │   ├── login/       # Endpoint autentikasi
│   │   │   ├── logout/      # Endpoint logout
│   │   │   └── register/    # Endpoint registrasi
│   │   ├── login/           # Halaman login (public)
│   │   ├── register/        # Halaman registrasi (public)
│   │   └── globals.css      # Style global
│   ├── components/
│   │   ├── auth-provider.tsx # Context autentikasi global
│   │   └── ui/              # Komponen UI (shadcn/ui)
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Utilitas & service
│   │   └── inventoryService.ts # Fungsi CRUD ke Firestore
│   └── types/               # Definisi tipe TypeScript
├── electron.js              # Entry point Electron
├── apphosting.yaml          # Konfigurasi Firebase App Hosting
├── next.config.mjs          # Konfigurasi Next.js
├── tailwind.config.ts       # Konfigurasi Tailwind CSS
└── tsconfig.json            # Konfigurasi TypeScript
```

---

## 👥 Peran Pengguna (Role)

Aplikasi ini mendukung dua peran pengguna dengan hak akses yang berbeda:

| Fitur | 👤 User | 👑 Admin |
|---|:---:|:---:|
| Login & Logout | ✅ | ✅ |
| Melihat data inventaris | ✅ | ✅ |
| Mencari & memfilter data | ✅ | ✅ |
| Menambah data barang | ❌ | ✅ |
| Mengubah data barang | ❌ | ✅ |
| Menghapus data barang | ❌ | ✅ |
| Impor data dari Excel | ❌ | ✅ |
| Akses halaman Dashboard | ❌ | ✅ |
| Membuat & mengunduh Laporan | ❌ | ✅ |

---

## 📋 Panduan Penggunaan

### Impor Data dari Excel

1. Masuk sebagai **Admin**
2. Buka halaman **Inventaris**
3. Klik tombol **"Impor Data"**
4. Pilih file `.xlsx` atau `.xls` sesuai format yang ditentukan
5. Data akan divalidasi dan disimpan secara otomatis ke Firestore

> Format kolom Excel harus sesuai dengan urutan kolom yang didefinisikan dalam `headerOrder` di `src/types/index.ts`.

### Membuat Laporan

1. Masuk sebagai **Admin**
2. Buka halaman **Laporan**
3. Pilih **Jenis Laporan**: Seluruh Inventaris, Barang Aktif, Barang Dihapus, atau Laporan Pengadaan
4. Pilih **Format File**: CSV, Excel (.xlsx), atau PDF
5. (Opsional) Atur **Rentang Tanggal** untuk laporan pengadaan
6. Klik **"Unduh Laporan"**

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---
