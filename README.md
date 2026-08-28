<h1 align="center">
  <img src="https://img.icons8.com/fluency/96/school.png" alt="School Inventory Logo" width="80"/>
  <br/>
  School Inventory
</h1>

<p align="center">
  A modern, responsive, and role-based web application for managing school assets and inventory.
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

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Application Architecture](#-application-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Configuration](#-installation--configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [User Roles & Permissions](#-user-roles--permissions)
- [Usage Guide](#-usage-guide)
- [License](#-license)

---

<img width="1914" height="957" alt="SchoolInventory1" src="https://github.com/user-attachments/assets/d70c6b35-e314-4d92-b7e9-bd9881e594b7" />


## 🏫 About the Project

**School Inventory** is a web-based asset management system specifically designed for school environments. It enables centralized management of school assets — from recording items and monitoring their condition, to generating reports in multiple formats.

Built with **Next.js 15** and **Firebase Firestore** as a real-time backend, the application delivers a fast, responsive, and secure experience with a role-based authentication system supporting **Admin** and **User** roles.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | Login & registration with route protection based on user roles (Admin / User) |
| 📦 **Inventory Management** | Add, edit, delete, and view detailed asset records |
| 🔍 **Search & Filter** | Instantly search items by type, brand/model, or sub-category |
| 📊 **Admin Dashboard** | Summary statistics: total value, total items, active items, and a yearly procurement chart |
| 📥 **Bulk Import (Excel)** | Import inventory data in bulk from `.xlsx` / `.xls` files |
| 📤 **Report Export** | Download reports in **CSV**, **Excel (.xlsx)**, or **PDF** format |
| 🗂️ **Report Filtering** | Filter reports by item status (active/disposed) and procurement date range |
| 📱 **Fully Responsive** | Optimized layout for desktop, tablet, and mobile devices |
| 🖥️ **Desktop App (Electron)** | Can be packaged as a native cross-platform desktop application (Windows, macOS, Linux) |

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** — React framework with App Router & Turbopack
- **[React 19](https://react.dev/)** — UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** — Static typing for code reliability
- **[Tailwind CSS 3](https://tailwindcss.com/)** — Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Accessible UI components built on Radix UI
- **[Lucide React](https://lucide.dev/)** — Icon library

### Backend & Database
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** — Real-time NoSQL cloud database
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** — User authentication service
- **[MongoDB / Mongoose](https://mongoosejs.com/)** — Optional for alternative data persistence

### Data & Reporting
- **[TanStack Table v8](https://tanstack.com/table/latest)** — Powerful data table with sorting, filtering, and pagination
- **[SheetJS (xlsx)](https://sheetjs.com/)** — Excel file import & export
- **[jsPDF](https://github.com/parallax/jsPDF)** — Client-side PDF report generation
- **[Recharts](https://recharts.org/)** — Data visualization & charting
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — Form management & schema validation

### Desktop
- **[Electron 38](https://www.electronjs.org/)** — Native desktop application packaging

### Deployment
- **[Firebase App Hosting](https://firebase.google.com/docs/app-hosting)** — Cloud deployment & hosting

---

## 🏗️ Application Architecture

The application uses the **Next.js App Router** with a route group pattern:

```
/                   → Redirects to /login or /dashboard
/login              → Public authentication page
/register           → Public user registration page
/dashboard          → Admin statistics dashboard (Admin only)
/inventory          → Asset management table (Admin & User)
/laporan            → Report generation & download (Admin only)
```

Data is streamed in **real-time** from Firebase Firestore using `onSnapshot` listeners, so any changes are immediately reflected in the UI without requiring a page refresh.

---

## 💻 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x or **bun** >= 1.x
- A **Firebase** account (for Firestore & Authentication)
- A modern browser (Chrome, Edge, Firefox)

---

## ⚙️ Installation & Configuration

### 1. Clone the Repository

```bash
git clone https://github.com/DeniFirmansyah18/School-Inventory.git
cd School-Inventory
```

### 2. Install Dependencies

```bash
npm install
# or using bun
bun install
```

### 3. Configure Firebase

Create a project in the [Firebase Console](https://console.firebase.google.com/), then enable **Firestore Database** and **Authentication** (Email/Password provider).

Create a `.env.local` file in the project root and fill it with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **⚠️ Important:** Never commit your `.env.local` file to version control. It is already listed in `.gitignore`.

### 4. Configure Firestore Security Rules

Set up appropriate Firestore security rules in your Firebase Console to restrict data access based on user authentication.

---

## 🚀 Running the Application

### Development Mode (Web)

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

### Production Build

```bash
npm run build
npm run start
```

### Desktop Mode (Electron)

```bash
npm run electron
```

> This command concurrently starts the dev server and opens an Electron window.

### Build Desktop Installer

```bash
npm run electron-pack
```

Generates platform-specific installers in the `dist/` folder:
- **Windows** → `.exe` (NSIS Installer)
- **macOS** → `.dmg`
- **Linux** → `.AppImage`

---

## 📁 Project Structure

```
School-Inventory/
├── docs/                        # Project documentation
│   └── blueprint.md             # App design & style guidelines
├── src/
│   ├── ai/                      # Genkit AI configuration (optional)
│   ├── app/
│   │   ├── (main)/              # Authenticated route group
│   │   │   ├── dashboard/       # Admin statistics dashboard
│   │   │   ├── inventory/       # Inventory management module
│   │   │   │   ├── columns.tsx          # Table column definitions
│   │   │   │   ├── inventory-detail.tsx # Item detail view component
│   │   │   │   ├── inventory-form.tsx   # Add/edit item form
│   │   │   │   ├── inventory-table.tsx  # Main inventory data table
│   │   │   │   └── page.tsx
│   │   │   ├── laporan/         # Report generation module
│   │   │   └── layout.tsx       # Main layout (sidebar + header)
│   │   ├── api/                 # Next.js API Routes
│   │   │   ├── inventory/       # Inventory CRUD endpoints
│   │   │   ├── login/           # Authentication endpoint
│   │   │   ├── logout/          # Logout endpoint
│   │   │   └── register/        # Registration endpoint
│   │   ├── login/               # Public login page
│   │   ├── register/            # Public registration page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── auth-provider.tsx    # Global authentication context
│   │   └── ui/                  # Reusable UI components (shadcn/ui)
│   ├── hooks/                   # Custom React Hooks
│   ├── lib/                     # Utilities & service layer
│   │   └── inventoryService.ts  # Firestore CRUD operations
│   └── types/                   # TypeScript type definitions
├── electron.js                  # Electron main process entry point
├── apphosting.yaml              # Firebase App Hosting configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 👥 User Roles & Permissions

The application enforces two distinct roles with different access levels:

| Feature | 👤 User | 👑 Admin |
|---|:---:|:---:|
| Login & Logout | ✅ | ✅ |
| View inventory data | ✅ | ✅ |
| Search & filter items | ✅ | ✅ |
| Add new inventory item | ❌ | ✅ |
| Edit inventory item | ❌ | ✅ |
| Delete inventory item | ❌ | ✅ |
| Import data from Excel | ❌ | ✅ |
| Access Admin Dashboard | ❌ | ✅ |
| Generate & download reports | ❌ | ✅ |

---

## 📋 Usage Guide

### Importing Data from Excel

1. Log in as an **Admin**
2. Navigate to the **Inventory** page
3. Click the **"Import Data"** button
4. Select your `.xlsx` or `.xls` file matching the required column format
5. Data will be automatically validated and saved to Firestore

> The Excel column order must match the `headerOrder` array defined in `src/types/index.ts`.

### Generating a Report

1. Log in as an **Admin**
2. Navigate to the **Report** page
3. Select a **Report Type**: All Inventory, Active Items, Disposed Items, or Procurement Report
4. Select a **File Format**: CSV, Excel (.xlsx), or PDF
5. *(Optional)* Set a **Date Range** for the procurement report
6. Click **"Download Report"**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/DeniFirmansyah18">Deni Firmansyah</a>
</p>
