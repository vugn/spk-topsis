<?php

namespace Database\Seeders;

use App\Models\Alternative;
use App\Models\Criterion;
use App\Models\Evaluation;
use Illuminate\Database\Seeder;

class TopsisSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Alternatives (contoh pemilihan karyawan terbaik)
        $alternatives = [
            [
                'name' => 'Ahmad Syukur',
                'description' => 'Karyawan senior dengan pengalaman 8 tahun di bidang IT'
            ],
            [
                'name' => 'Siti Nurhayati',
                'description' => 'Karyawan dengan kemampuan leadership yang baik'
            ],
            [
                'name' => 'Budi Santoso',
                'description' => 'Fresh graduate dengan kemampuan teknis tinggi'
            ],
            [
                'name' => 'Maya Sari',
                'description' => 'Karyawan dengan komunikasi dan kerjasama tim yang excellent'
            ],
            [
                'name' => 'Eko Prasetyo',
                'description' => 'Karyawan dengan dedikasi tinggi dan fleksibilitas waktu'
            ]
        ];

        foreach ($alternatives as $alt) {
            Alternative::create($alt);
        }

        // Seed Criteria
        $criteria = [
            [
                'name' => 'Pengalaman Kerja',
                'description' => 'Lama pengalaman kerja dalam tahun',
                'weight' => 0.25,
                'type' => 'benefit'
            ],
            [
                'name' => 'Kemampuan Teknis',
                'description' => 'Kemampuan teknis dalam skala 1-10',
                'weight' => 0.30,
                'type' => 'benefit'
            ],
            [
                'name' => 'Komunikasi',
                'description' => 'Kemampuan komunikasi dalam skala 1-10',
                'weight' => 0.20,
                'type' => 'benefit'
            ],
            [
                'name' => 'Tingkat Absensi',
                'description' => 'Jumlah hari tidak masuk dalam setahun',
                'weight' => 0.15,
                'type' => 'cost'
            ],
            [
                'name' => 'Gaji yang Diharapkan',
                'description' => 'Gaji yang diharapkan dalam jutaan rupiah',
                'weight' => 0.10,
                'type' => 'cost'
            ]
        ];

        foreach ($criteria as $crit) {
            Criterion::create($crit);
        }

        // Seed Evaluations
        $evaluationData = [
            // Ahmad Syukur
            [1, 1, 8],    // Pengalaman: 8 tahun
            [1, 2, 7.5],  // Kemampuan Teknis: 7.5
            [1, 3, 8],    // Komunikasi: 8
            [1, 4, 3],    // Absensi: 3 hari
            [1, 5, 12],   // Gaji: 12 juta

            // Siti Nurhayati
            [2, 1, 6],    // Pengalaman: 6 tahun
            [2, 2, 8],    // Kemampuan Teknis: 8
            [2, 3, 9],    // Komunikasi: 9
            [2, 4, 2],    // Absensi: 2 hari
            [2, 5, 10],   // Gaji: 10 juta

            // Budi Santoso
            [3, 1, 1],    // Pengalaman: 1 tahun
            [3, 2, 9],    // Kemampuan Teknis: 9
            [3, 3, 7],    // Komunikasi: 7
            [3, 4, 1],    // Absensi: 1 hari
            [3, 5, 7],    // Gaji: 7 juta

            // Maya Sari
            [4, 1, 4],    // Pengalaman: 4 tahun
            [4, 2, 7],    // Kemampuan Teknis: 7
            [4, 3, 9.5],  // Komunikasi: 9.5
            [4, 4, 2],    // Absensi: 2 hari
            [4, 5, 9],    // Gaji: 9 juta

            // Eko Prasetyo
            [5, 1, 5],    // Pengalaman: 5 tahun
            [5, 2, 8.5],  // Kemampuan Teknis: 8.5
            [5, 3, 8],    // Komunikasi: 8
            [5, 4, 1],    // Absensi: 1 hari
            [5, 5, 8.5],  // Gaji: 8.5 juta
        ];

        foreach ($evaluationData as $eval) {
            Evaluation::create([
                'alternative_id' => $eval[0],
                'criterion_id' => $eval[1],
                'value' => $eval[2]
            ]);
        }
    }
}
