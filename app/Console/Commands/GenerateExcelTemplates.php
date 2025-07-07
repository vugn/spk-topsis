<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class GenerateExcelTemplates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'templates:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Excel templates for import data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating Excel templates...');

        // Alternative template
        $alternativeData = [
            ['Nama', 'Deskripsi'],
            ['Smartphone Samsung Galaxy S23', 'Smartphone flagship dengan kamera canggih'],
            ['iPhone 14 Pro', 'iPhone terbaru dengan chip A16 Bionic'],
            ['Google Pixel 7', 'Smartphone Google dengan kamera AI terbaik'],
            ['OnePlus 11', 'Smartphone gaming dengan performa tinggi'],
            ['Xiaomi 13 Pro', 'Smartphone dengan layar AMOLED berkualitas tinggi']
        ];

        Excel::store(new class($alternativeData) implements \Maatwebsite\Excel\Concerns\FromArray {
            private $data;
            public function __construct($data) { $this->data = $data; }
            public function array(): array { return $this->data; }
        }, 'templates/template_alternatif.xlsx');

        // Criteria template
        $criteriaData = [
            ['Nama', 'Deskripsi', 'Bobot', 'Tipe'],
            ['Harga', 'Harga smartphone dalam jutaan rupiah', '0.3', 'cost'],
            ['Kualitas Kamera', 'Kualitas kamera untuk foto dan video (skala 1-10)', '0.25', 'benefit'],
            ['Performa', 'Performa processor dan RAM (skala 1-10)', '0.25', 'benefit'],
            ['Daya Tahan Baterai', 'Daya tahan baterai dalam jam (skala 1-10)', '0.2', 'benefit']
        ];

        Excel::store(new class($criteriaData) implements \Maatwebsite\Excel\Concerns\FromArray {
            private $data;
            public function __construct($data) { $this->data = $data; }
            public function array(): array { return $this->data; }
        }, 'templates/template_kriteria.xlsx');

        // Evaluation template
        $evaluationData = [
            ['Alternatif', 'Kriteria', 'Nilai'],
            ['Smartphone Samsung Galaxy S23', 'Harga', '15'],
            ['Smartphone Samsung Galaxy S23', 'Kualitas Kamera', '9'],
            ['Smartphone Samsung Galaxy S23', 'Performa', '9'],
            ['Smartphone Samsung Galaxy S23', 'Daya Tahan Baterai', '8'],
            ['iPhone 14 Pro', 'Harga', '18'],
            ['iPhone 14 Pro', 'Kualitas Kamera', '9'],
            ['iPhone 14 Pro', 'Performa', '10'],
            ['iPhone 14 Pro', 'Daya Tahan Baterai', '8'],
            ['Google Pixel 7', 'Harga', '10'],
            ['Google Pixel 7', 'Kualitas Kamera', '10'],
            ['Google Pixel 7', 'Performa', '8'],
            ['Google Pixel 7', 'Daya Tahan Baterai', '7'],
            ['OnePlus 11', 'Harga', '12'],
            ['OnePlus 11', 'Kualitas Kamera', '8'],
            ['OnePlus 11', 'Performa', '9'],
            ['OnePlus 11', 'Daya Tahan Baterai', '9'],
            ['Xiaomi 13 Pro', 'Harga', '11'],
            ['Xiaomi 13 Pro', 'Kualitas Kamera', '8'],
            ['Xiaomi 13 Pro', 'Performa', '8'],
            ['Xiaomi 13 Pro', 'Daya Tahan Baterai', '8']
        ];

        Excel::store(new class($evaluationData) implements \Maatwebsite\Excel\Concerns\FromArray {
            private $data;
            public function __construct($data) { $this->data = $data; }
            public function array(): array { return $this->data; }
        }, 'templates/template_evaluasi.xlsx');

        $this->info('✅ Excel templates generated successfully!');
        $this->info('📁 Files saved to storage/app/templates/');
        $this->line('   - template_alternatif.xlsx');
        $this->line('   - template_kriteria.xlsx');
        $this->line('   - template_evaluasi.xlsx');
    }
}
