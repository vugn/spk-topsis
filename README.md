# SPK TOPSIS - Sistem Penunjang Keputusan dengan Metode TOPSIS

Aplikasi web untuk Sistem Penunjang Keputusan menggunakan metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) yang dibangun dengan Laravel dan React. Aplikasi ini menyediakan solusi lengkap untuk pengambilan keputusan multi-kriteria dengan interface yang modern dan user-friendly.

## Fitur Utama

### 1. **Dashboard Interaktif**
- Statistik lengkap sistem (jumlah alternatif, kriteria, evaluasi, hasil)
- Top 5 hasil TOPSIS terbaik dengan ranking
- Data terbaru alternatif dan kriteria
- Quick actions untuk perhitungan TOPSIS
- **Export dashboard ke PDF** dengan laporan lengkap

### 2. **Manajemen Alternatif**
- CRUD (Create, Read, Update, Delete) alternatif
- Informasi detail setiap alternatif dengan deskripsi
- Interface yang user-friendly dan responsif
- **Export data alternatif ke PDF**
- **Import data alternatif dari Excel**

### 3. **Manajemen Kriteria**
- CRUD kriteria dengan bobot dan tipe (benefit/cost)
- Validasi total bobot kriteria (harus = 100%)
- Pengaturan tipe kriteria untuk perhitungan TOPSIS
- **Export data kriteria ke PDF** dengan ringkasan bobot
- **Import data kriteria dari Excel** dengan validasi otomatis

### 4. **Evaluasi Multi-Kriteria**
- Input evaluasi dalam bentuk matriks interaktif
- Bulk input untuk efisiensi kerja
- Validasi data evaluasi real-time
- **Export matriks evaluasi ke PDF** (format landscape)
- **Import data evaluasi dari Excel** dengan mapping otomatis

### 5. **Perhitungan TOPSIS Lengkap**
- Algoritma TOPSIS lengkap dengan langkah-langkah:
  - Normalisasi matriks keputusan
  - Pembobotan matriks ternormalisasi
  - Penentuan solusi ideal positif dan negatif
  - Perhitungan jarak dan skor preferensi
  - Ranking alternatif berdasarkan skor
- Penyimpanan hasil ke database
- **Export hasil TOPSIS ke PDF** dengan analisis lengkap
- Visualisasi hasil dengan grafik interaktif

### 6. **Visualisasi Data dan Charts**
- Grafik batang skor preferensi interaktif
- Grafik perbandingan ranking alternatif
- Charts responsif menggunakan Recharts
- **Export charts ke PDF** dengan kualitas tinggi
- Visualisasi yang mobile-friendly

### 7. **📊 Export Data ke PDF**
- Export semua data ke format PDF profesional
- Template PDF yang konsisten dan rapi
- Support untuk:
  - Data alternatif dengan tabel terstruktur
  - Data kriteria dengan ringkasan bobot
  - Matriks evaluasi dalam format landscape
  - Hasil TOPSIS dengan analisis mendalam
  - Charts dan grafik berkualitas tinggi
  - Dashboard report komprehensif
- Error handling yang robust untuk kompatibilitas browser

### 8. **📥 Import Data dari Excel**
- Import data dari file Excel (.xlsx, .xls, .csv)
- Template Excel yang dapat didownload
- Validasi data otomatis saat import
- Support untuk:
  - Import alternatif dengan nama dan deskripsi
  - Import kriteria dengan bobot dan tipe
  - Import matriks evaluasi dengan mapping relasi
- Error handling dan feedback real-time
- Batch processing untuk efisiensi

## Teknologi yang Digunakan

### Backend
- **Laravel 12** - PHP Framework
- **Inertia.js** - Modern monolith untuk SPA experience
- **SQLite** - Database ringan dan cepat
- **Eloquent ORM** - Database abstraction
- **Laravel Excel** - Excel import/export functionality

### Frontend
- **React 18** - UI Library dengan hooks modern
- **TypeScript** - Type safety dan developer experience
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization library
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons
- **jsPDF** - PDF generation client-side
- **html2canvas** - Chart to image conversion

### Tools & Libraries
- **Vite** - Fast build tool dan development server
- **Pest** - Modern PHP testing framework
- **Laravel Pint** - Code formatting
- **ESLint** - JavaScript/TypeScript linting

## Instalasi dan Setup

### Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+
- NPM atau Yarn

### Langkah Instalasi

1. **Clone repository dan install dependencies**
   ```bash
   git clone <repository-url>
   cd spk-topsis
   composer install
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Setup database**
   ```bash
   php artisan migrate
   php artisan db:seed --class=TopsisSeeder
   ```

4. **Build frontend assets**
   ```bash
   npm run build
   ```

5. **Jalankan aplikasi**
   ```bash
   php artisan serve
   ```

6. **Akses aplikasi**
   Buka browser dan kunjungi: `http://127.0.0.1:8000`

## Penggunaan

### 1. **Setup Data Awal**
- Buat akun atau login ke sistem
- Tambah alternatif melalui menu "Alternatif" atau **import dari Excel**
- Tambah kriteria dengan bobot dan tipe melalui menu "Kriteria" atau **import dari Excel**
- Input evaluasi melalui menu "Evaluasi" atau **import dari Excel**

### 2. **Import Data (Cara Cepat)**
- Kunjungi menu "Import Data"
- Download template Excel untuk format yang benar
- Isi data sesuai template dan upload file
- Sistem akan memvalidasi dan mengimpor data otomatis

### 3. **Perhitungan TOPSIS**
- Klik "Hitung TOPSIS" di dashboard atau menu "TOPSIS"
- Sistem akan menjalankan algoritma TOPSIS secara otomatis
- Hasil akan ditampilkan dengan ranking dan skor preferensi

### 4. **Analisis dan Export Hasil**
- Lihat hasil ranking di halaman "TOPSIS"
- Analisis visualisasi data di halaman "Charts"
- **Export hasil ke PDF** untuk dokumentasi atau presentasi
- **Export charts** untuk laporan visual

## Data Sample

Aplikasi sudah dilengkapi dengan data sample untuk testing:

### Alternatif (5 kandidat karyawan):
- Ahmad Syukur - Kandidat dengan pengalaman senior
- Budi Santoso - Fresh graduate dengan potensi tinggi
- Siti Nurhayati - Kandidat dengan komunikasi excellent
- Maya Sari - Spesialis dengan keahlian khusus
- Eko Prasetyo - Kandidat dengan background teknis kuat

### Kriteria (5 kriteria penilaian):
- **Pengalaman Kerja** (Bobot: 25%, Benefit) - Lamanya pengalaman kerja
- **Pendidikan** (Bobot: 20%, Benefit) - Tingkat pendidikan formal
- **Kemampuan Komunikasi** (Bobot: 20%, Benefit) - Skill komunikasi dan interpersonal
- **Gaji yang Diharapkan** (Bobot: 15%, Cost) - Ekspektasi gaji kandidat
- **Usia** (Bobot: 20%, Cost) - Usia kandidat

### Template Excel Ready-to-Use
Aplikasi menyediakan template Excel yang bisa langsung digunakan:
- `template_alternatif.xlsx` - Template untuk import alternatif
- `template_kriteria.xlsx` - Template untuk import kriteria dengan validasi bobot
- `template_evaluasi.xlsx` - Template untuk import matriks evaluasi

## Fitur Export & Import

### 📊 Export ke PDF
- **Dashboard Report**: Laporan lengkap dengan statistik dan grafik
- **Data Tables**: Semua data dalam format tabel yang rapi
- **Charts**: Visualisasi berkualitas tinggi
- **Analysis Results**: Hasil TOPSIS dengan penjelasan detail

### 📥 Import dari Excel
- **Batch Import**: Import banyak data sekaligus
- **Data Validation**: Validasi otomatis dengan error reporting
- **Template Download**: Template siap pakai untuk setiap jenis data
- **Error Handling**: Feedback jelas untuk setiap kesalahan input

## Algoritma TOPSIS

### Langkah-langkah:

1. **Normalisasi Matriks Keputusan**
   ```
   r_ij = x_ij / √(Σx_ij²)
   ```

2. **Pembobotan Matriks Ternormalisasi**
   ```
   v_ij = w_j × r_ij
   ```

3. **Solusi Ideal Positif dan Negatif**
   - A⁺ = {max(v_ij) jika benefit, min(v_ij) jika cost}
   - A⁻ = {min(v_ij) jika benefit, max(v_ij) jika cost}

4. **Perhitungan Jarak**
   ```
   D⁺_i = √Σ(v_ij - A⁺_j)²
   D⁻_i = √Σ(v_ij - A⁻_j)²
   ```

5. **Skor Preferensi**
   ```
   C_i = D⁻_i / (D⁺_i + D⁻_i)
   ```

## Struktur Database

### Core Tables:
- `alternatives` - Data alternatif dengan nama dan deskripsi
- `criteria` - Data kriteria dengan bobot dan tipe (benefit/cost)
- `evaluations` - Data evaluasi/penilaian (matriks keputusan)
- `topsis_results` - Hasil perhitungan TOPSIS dengan ranking
- `users` - Data pengguna sistem

### Relationships:
- `evaluations` → `alternatives` (Many-to-One)
- `evaluations` → `criteria` (Many-to-One)
- `topsis_results` → `alternatives` (Many-to-One)

## File Structure

### Key Directories:
```
app/
├── Http/Controllers/          # Controllers untuk API endpoints
├── Models/                    # Eloquent models
├── Services/                  # Business logic (TopsisService)
├── Imports/                   # Excel import classes
└── Console/Commands/          # Artisan commands

resources/js/
├── pages/                     # React pages/components
├── components/                # Reusable UI components
├── layouts/                   # Layout components
└── utils/                     # Utility functions (pdfExport)

storage/app/templates/         # Excel templates for import
public/build/                  # Compiled frontend assets
```

## Testing & Development

### Quick Testing:
```bash
# Test aplikasi
php test_app.php

# Generate Excel templates
php artisan templates:generate

# Development server
npm run dev

# Production build
npm run build
```

### PDF Export Testing:
Buka `public/test-pdf-export.html` untuk testing PDF export functionality secara manual.

## Deployment

### Production Ready Features:
- ✅ Optimized Vite build dengan code splitting
- ✅ Laravel production configuration
- ✅ SQLite database (portable)
- ✅ Error handling dan user feedback
- ✅ Responsive design untuk mobile
- ✅ SEO-friendly routing dengan Inertia.js

### Environment Setup:
```bash
# Production environment
cp .env.example .env.production
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

## Changelog & Updates

### v2.0 (Latest) - Comprehensive Data Management
- ✨ **New**: Excel Import functionality untuk semua data types
- ✨ **New**: PDF Export untuk semua komponen (tables, charts, dashboard)
- ✨ **New**: Professional PDF templates dengan branding
- ✨ **New**: Excel templates ready-to-use
- 🔧 **Improved**: Error handling dan user feedback
- 🔧 **Improved**: UI/UX dengan modern design
- 🔧 **Improved**: Mobile responsiveness
- 🐛 **Fixed**: Type safety issues dengan TypeScript
- 🐛 **Fixed**: Chart compatibility dengan html2canvas

### v1.0 - Core TOPSIS Implementation
- ✅ Basic CRUD operations
- ✅ TOPSIS algorithm implementation
- ✅ Data visualization dengan charts
- ✅ User authentication
- ✅ Dashboard dengan statistics

## Browser Compatibility

### Supported Browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### PDF Export Requirements:
- Modern browser dengan support untuk:
  - HTML5 Canvas API
  - File download API
  - ES6+ JavaScript features

## Performance Features

- ⚡ **Fast Loading**: Vite untuk development dan build
- ⚡ **Code Splitting**: Automatic code splitting untuk optimal loading
- ⚡ **Lazy Loading**: Charts dan components dimuat saat diperlukan
- ⚡ **Caching**: Laravel caching untuk database queries
- ⚡ **Optimized Images**: Automatic image optimization
- ⚡ **Gzip Compression**: Built-in asset compression

## Security Features

- 🔒 **Authentication**: Laravel Sanctum untuk API security
- 🔒 **Authorization**: Role-based access control
- 🔒 **Input Validation**: Comprehensive validation untuk semua inputs
- 🔒 **CSRF Protection**: Built-in CSRF protection
- 🔒 **SQL Injection Prevention**: Eloquent ORM protection
- 🔒 **XSS Protection**: Automatic output escaping

## Kontribusi

Kami menyambut kontribusi dari komunitas! Berikut cara untuk berkontribusi:

### Development Setup:
1. Fork repository ini
2. Clone ke local machine: `git clone <your-fork-url>`
3. Install dependencies: `composer install && npm install`
4. Setup environment: `cp .env.example .env && php artisan key:generate`
5. Run migrations: `php artisan migrate`
6. Start development: `npm run dev`

### Contributing Guidelines:
1. Buat feature branch (`git checkout -b feature/amazing-feature`)
2. Follow coding standards (Laravel Pint untuk PHP, ESLint untuk JS/TS)
3. Write tests untuk new features
4. Commit dengan clear message (`git commit -m 'Add amazing feature'`)
5. Push ke branch (`git push origin feature/amazing-feature`)
6. Buat Pull Request dengan deskripsi yang jelas

### Code Standards:
- **PHP**: Follow PSR-12 coding standards
- **TypeScript/React**: Follow ESLint dan Prettier configuration
- **Database**: Use Eloquent migrations untuk schema changes
- **Testing**: Write tests untuk new functionality

## Lisensi

MIT License - see [LICENSE](LICENSE) file for details.

## Support & Community

### Getting Help:
- 📖 **Documentation**: Lengkap di README ini
- 🐛 **Bug Reports**: Gunakan GitHub Issues
- 💡 **Feature Requests**: Diskusi di GitHub Discussions
- 📧 **Direct Support**: Email untuk support khusus

### Resources:
- 📚 [TOPSIS Algorithm Theory](https://en.wikipedia.org/wiki/TOPSIS)
- 🎯 [Laravel Documentation](https://laravel.com/docs)
- ⚛️ [React Documentation](https://react.dev)
- 🎨 [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

**🎯 SPK TOPSIS** 

*Memudahkan pengambilan keputusan dengan metode ilmiah yang terpercaya*

**Made with ❤️ using Laravel & React**

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>
