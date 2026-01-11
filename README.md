# 📝 Sticky Notes App

Aplikasi manajemen catatan (notes) yang powerful dan intuitif dengan fitur drag-and-drop, kanban board, calendar view, dan sistem tagging. Dibangun dengan React, TypeScript, dan Tailwind CSS.

![Sticky Notes App](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ Fitur Utama

### 📋 Board Management
- **Simple Board**: Board sederhana dengan satu kolom untuk catatan cepat
- **Kanban Board**: Board dengan multiple kolom (To Do, In Progress, Done) untuk manajemen proyek
- **Drag & Drop**: Pindahkan notes antar kolom dengan mudah menggunakan @dnd-kit
- **Multiple Boards**: Buat dan kelola banyak board sesuai kebutuhan

### 🗒️ Sticky Notes
- **Warna Beragam**: 6 pilihan warna (Yellow, Blue, Pink, Green, Orange, White)
- **Checklist Items**: Tambah item checklist dengan berbagai tipe:
  - ☐ Todo - Item yang perlu dikerjakan
  - ⏳ Doing - Item yang sedang dikerjakan
  - ✅ Done - Item yang sudah selesai
  - 📅 Event - Item event/acara
  - 📝 Note - Catatan biasa
  - ❌ Cancelled - Item yang dibatalkan
- **Due Date**: Tetapkan tanggal jatuh tempo untuk setiap note
- **Progress Tracking**: Lihat progress penyelesaian checklist (e.g., 2/5)

### 🏷️ Tags & Filtering
- **Custom Tags**: Buat tag dengan 8 pilihan warna
- **Tag Colors**: Red, Orange, Yellow, Green, Blue, Purple, Pink, Gray
- **Filter by Tag**: Filter notes berdasarkan tag untuk fokus pada kategori tertentu
- **Multiple Tags per Note**: Assign banyak tag ke satu note

### 📅 Calendar Views
- **Daily View**: Lihat notes berdasarkan tanggal harian dengan date picker
- **Weekly View**: Overview notes dalam satu minggu dengan grid 7 hari
- **Monthly View**: Kalender bulan penuh dengan preview notes di setiap tanggal
- **Navigation**: Navigasi mudah antar hari/minggu/bulan

### 🎨 User Interface
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Dark Mode Ready**: Struktur siap untuk dark mode
- **Collapsible Sidebar**: Sidebar yang bisa disembunyikan untuk fokus
- **Mobile Menu**: Menu khusus untuk tampilan mobile
- **Floating Action Button**: Tombol cepat untuk menambah note di mobile

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI Components |
| [Zustand](https://zustand-demo.pmnd.rs/) | State Management |
| [@dnd-kit](https://dndkit.com/) | Drag and Drop |
| [date-fns](https://date-fns.org/) | Date Manipulation |
| [Lucide React](https://lucide.dev/) | Icons |
| [React Router](https://reactrouter.com/) | Routing |

## 📁 Struktur Project

```
src/
├── components/
│   ├── notes/
│   │   ├── Board.tsx           # Komponen board utama dengan kolom
│   │   ├── CalendarView.tsx    # Daily, Weekly, Monthly calendar views
│   │   ├── Column.tsx          # Kolom kanban dengan drag-drop
│   │   ├── CreateBoardDialog.tsx # Dialog untuk membuat board baru
│   │   ├── NotesApp.tsx        # Komponen utama aplikasi
│   │   ├── Sidebar.tsx         # Sidebar navigasi dengan boards, tags, calendar
│   │   └── StickyNote.tsx      # Komponen sticky note individual
│   └── ui/                     # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx          # Hook untuk deteksi mobile
│   └── use-toast.ts            # Hook untuk toast notifications
├── lib/
│   └── utils.ts                # Utility functions (cn, etc.)
├── pages/
│   ├── Index.tsx               # Halaman utama
│   └── NotFound.tsx            # Halaman 404
├── stores/
│   └── notesStore.ts           # Zustand store untuk state management
├── types/
│   └── notes.ts                # TypeScript type definitions
├── App.tsx                     # Root component dengan routing
├── App.css                     # Global styles
├── index.css                   # Tailwind imports & CSS variables
└── main.tsx                    # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau bun

### Installation

1. **Clone repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   bun install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   # atau
   bun dev
   ```

4. **Buka browser**
   ```
   http://localhost:5173
   ```

### Build untuk Production

```bash
npm run build
# atau
bun build
```

## 📖 Panduan Penggunaan

### Membuat Board Baru
1. Klik tombol **"+ New Board"** di header atau sidebar
2. Masukkan nama board
3. Pilih tipe board:
   - **Simple**: Satu kolom untuk catatan sederhana
   - **Kanban**: Tiga kolom (To Do, In Progress, Done)
4. Klik **"Create Board"**

### Menambah Note
1. Klik tombol **"+ Add Note"** di kolom yang diinginkan
2. Note baru akan muncul dengan judul default
3. Edit judul dengan mengklik langsung pada teks
4. Tambah checklist items sesuai kebutuhan

### Menggunakan Tags
1. Buka dropdown menu pada note (ikon tag)
2. Pilih tag yang ingin ditambahkan
3. Atau buat tag baru dari sidebar bagian Tags
4. Filter notes dengan mengklik tag di sidebar

### Mengatur Due Date
1. Klik ikon kalender pada note
2. Pilih tanggal jatuh tempo
3. Note akan muncul di Calendar View pada tanggal tersebut

### Menggunakan Calendar View
1. Di sidebar, klik **"Daily"**, **"Weekly"**, atau **"Monthly"**
2. Navigasi antar tanggal menggunakan tombol panah
3. Klik **"Today"** atau **"This Week"** untuk kembali ke tanggal saat ini

### Drag and Drop
1. Klik dan tahan pada note
2. Seret ke kolom tujuan
3. Lepaskan untuk memindahkan note

## 🔧 State Management

Aplikasi menggunakan **Zustand** untuk state management dengan struktur:

```typescript
interface NotesState {
  // Data
  boards: Board[];
  activeBoard: string | null;
  tags: Tag[];
  
  // UI State
  isSidebarOpen: boolean;
  currentView: 'boards' | 'calendar';
  calendarView: CalendarView;
  selectedDate: Date;
  activeTagFilter: string | null;
  
  // Actions
  createBoard: (title: string, type: 'simple' | 'kanban') => void;
  addNote: (columnId: string, dueDate?: string) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string, columnId: string) => void;
  moveNote: (noteId: string, fromColumnId: string, toColumnId: string) => void;
  // ... dan banyak lagi
}
```

Data disimpan di **localStorage** untuk persistensi offline.

## 🎨 Customization

### Menambah Warna Note Baru

Edit `src/types/notes.ts`:
```typescript
export type NoteColor = 'yellow' | 'blue' | 'pink' | 'green' | 'orange' | 'white' | 'purple';
```

Kemudian tambahkan style di `StickyNote.tsx`:
```typescript
const colorClasses: Record<NoteColor, string> = {
  // ... existing colors
  purple: 'bg-purple-100 border-purple-300',
};
```

### Menambah Tipe Checklist Item Baru

Edit `src/types/notes.ts`:
```typescript
export type ItemType = 'todo' | 'doing' | 'done' | 'event' | 'note' | 'cancelled' | 'important';
```

Tambahkan config di `StickyNote.tsx`:
```typescript
const itemTypeConfig: Record<ItemType, { icon: LucideIcon; color: string }> = {
  // ... existing types
  important: { icon: AlertCircle, color: 'text-red-500' },
};
```

## 📱 Responsive Breakpoints

| Breakpoint | Screen Size | Layout |
|------------|-------------|--------|
| `sm` | 640px+ | Mobile landscape |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Desktop |
| `xl` | 1280px+ | Large desktop |

## 🔮 Roadmap / Fitur Mendatang

- [ ] Cloud sync dengan Supabase
- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Note attachments (images, files)
- [ ] Reminder notifications
- [ ] Export/Import data
- [ ] Dark mode toggle
- [ ] Archive notes
- [ ] Search functionality
- [ ] Keyboard shortcuts

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Zustand](https://zustand-demo.pmnd.rs/) - Simple state management
- [@dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [date-fns](https://date-fns.org/) - Date manipulation library

---

<p align="center">
  Built with ❤️ using <a href="https://lovable.dev">Lovable</a>
</p>
