# SPK TOPSIS - Sistem Penunjang Keputusan dengan Metode TOPSIS

Aplikasi web untuk Sistem Penunjang Keputusan menggunakan metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) yang dibangun dengan Laravel dan React.

## Fitur Utama

### 1. **Dashboard**
- Statistik lengkap (jumlah alternatif, kriteria, evaluasi, hasil)
- Top 5 hasil TOPSIS terbaik
- Data terbaru alternatif dan kriteria
- Quick actions untuk perhitungan TOPSIS

### 2. **Manajemen Alternatif**
- CRUD (Create, Read, Update, Delete) alternatif
- Informasi detail setiap alternatif
- Interface yang user-friendly

### 3. **Manajemen Kriteria**
- CRUD kriteria dengan bobot dan tipe (benefit/cost)
- Validasi bobot kriteria
- Pengaturan tipe kriteria untuk perhitungan TOPSIS

### 4. **Evaluasi**
- Input evaluasi dalam bentuk matriks
- Bulk input untuk efisiensi
- Validasi data evaluasi

### 5. **Perhitungan TOPSIS**
- Algoritma TOPSIS lengkap dengan langkah-langkah:
  - Normalisasi matriks keputusan
  - Pembobotan matriks ternormalisasi
  - Penentuan solusi ideal positif dan negatif
  - Perhitungan jarak dan skor preferensi
  - Ranking alternatif
- Penyimpanan hasil ke database
- Visualisasi hasil dengan grafik interaktif

### 6. **Visualisasi Data**
- Grafik batang skor preferensi
- Grafik perbandingan ranking
- Charts responsif menggunakan Recharts

## Teknologi yang Digunakan

### Backend
- **Laravel 12** - PHP Framework
- **Inertia.js** - Modern monolith
- **SQLite** - Database
- **Eloquent ORM** - Database abstraction

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Shadcn/ui** - UI Components
- **Lucide React** - Icons

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
- Buat akun atau login
- Tambah alternatif melalui menu "Alternatif"
- Tambah kriteria dengan bobot dan tipe melalui menu "Kriteria"
- Input evaluasi melalui menu "Evaluasi"

### 2. **Perhitungan TOPSIS**
- Klik "Hitung TOPSIS" di dashboard atau menu "TOPSIS"
- Sistem akan menjalankan algoritma TOPSIS secara otomatis
- Hasil akan ditampilkan dengan ranking dan skor preferensi

### 3. **Analisis Hasil**
- Lihat hasil ranking di halaman "TOPSIS"
- Analisis visualisasi data di halaman "Charts"
- Export atau print hasil sesuai kebutuhan

## Data Sample

Aplikasi sudah dilengkapi dengan data sample:

### Alternatif (5 kandidat karyawan):
- Ahmad Syukur
- Budi Santoso
- Siti Nurhayati
- Maya Sari
- Eko Prasetyo

### Kriteria (5 kriteria penilaian):
- Pengalaman Kerja (Bobot: 25%, Benefit)
- Pendidikan (Bobot: 20%, Benefit)
- Kemampuan Komunikasi (Bobot: 20%, Benefit)
- Gaji yang Diharapkan (Bobot: 15%, Cost)
- Usia (Bobot: 20%, Cost)

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

### Tables:
- `alternatives` - Data alternatif
- `criteria` - Data kriteria dengan bobot dan tipe
- `evaluations` - Data evaluasi (matriks keputusan)
- `topsis_results` - Hasil perhitungan TOPSIS
- `users` - Data pengguna

## Testing

Jalankan test untuk memverifikasi fungsionalitas:

```bash
php test_app.php
```

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push branch (`git push origin feature/new-feature`)
5. Buat Pull Request

## Lisensi

MIT License

## Support

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.

---

**SPK TOPSIS** - Memudahkan pengambilan keputusan dengan metode ilmiah yang terpercaya.
