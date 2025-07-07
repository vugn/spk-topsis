<?php

namespace App\Http\Controllers;

use App\Imports\AlternativesImport;
use App\Imports\CriteriaImport;
use App\Imports\EvaluationsImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class ImportController extends Controller
{
    public function index()
    {
        return Inertia::render('Import/Index');
    }

    public function importAlternatives(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            $import = new AlternativesImport();
            Excel::import($import, $request->file('file'));

            $errors = $import->failures();
            $importErrors = $import->errors();

            if (!empty($errors) || !empty($importErrors)) {
                $errorMessages = [];

                foreach ($errors as $failure) {
                    $errorMessages[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
                }

                foreach ($importErrors as $error) {
                    $errorMessages[] = $error->getMessage();
                }

                return back()->with('error', 'Import gagal: ' . implode(' | ', $errorMessages));
            }

            return back()->with('success', 'Data alternatif berhasil diimpor!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function importCriteria(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            $import = new CriteriaImport();
            Excel::import($import, $request->file('file'));

            $errors = $import->failures();
            $importErrors = $import->errors();

            if (!empty($errors) || !empty($importErrors)) {
                $errorMessages = [];

                foreach ($errors as $failure) {
                    $errorMessages[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
                }

                foreach ($importErrors as $error) {
                    $errorMessages[] = $error->getMessage();
                }

                return back()->with('error', 'Import gagal: ' . implode(' | ', $errorMessages));
            }

            return back()->with('success', 'Data kriteria berhasil diimpor!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function importEvaluations(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            $import = new EvaluationsImport();
            Excel::import($import, $request->file('file'));

            $errors = $import->failures();
            $importErrors = $import->errors();

            if (!empty($errors) || !empty($importErrors)) {
                $errorMessages = [];

                foreach ($errors as $failure) {
                    $errorMessages[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
                }

                foreach ($importErrors as $error) {
                    $errorMessages[] = $error->getMessage();
                }

                return back()->with('error', 'Import gagal: ' . implode(' | ', $errorMessages));
            }

            return back()->with('success', 'Data evaluasi berhasil diimpor!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function downloadTemplate($type)
    {
        $templates = [
            'alternatives' => [
                'filename' => 'template_alternatif.xlsx',
                'headers' => ['Nama', 'Deskripsi'],
                'data' => [
                    ['Smartphone A', 'Smartphone dengan fitur canggih'],
                    ['Smartphone B', 'Smartphone dengan harga terjangkau'],
                    ['Smartphone C', 'Smartphone dengan daya tahan baterai lama'],
                ]
            ],
            'criteria' => [
                'filename' => 'template_kriteria.xlsx',
                'headers' => ['Nama', 'Deskripsi', 'Bobot', 'Tipe'],
                'data' => [
                    ['Harga', 'Harga smartphone', '0.3', 'cost'],
                    ['Kualitas Kamera', 'Kualitas kamera smartphone', '0.25', 'benefit'],
                    ['Performa', 'Performa processor smartphone', '0.25', 'benefit'],
                    ['Daya Tahan Baterai', 'Daya tahan baterai smartphone', '0.2', 'benefit'],
                ]
            ],
            'evaluations' => [
                'filename' => 'template_evaluasi.xlsx',
                'headers' => ['Alternatif', 'Kriteria', 'Nilai'],
                'data' => [
                    ['Smartphone A', 'Harga', '7'],
                    ['Smartphone A', 'Kualitas Kamera', '9'],
                    ['Smartphone A', 'Performa', '8'],
                    ['Smartphone A', 'Daya Tahan Baterai', '7'],
                    ['Smartphone B', 'Harga', '9'],
                    ['Smartphone B', 'Kualitas Kamera', '6'],
                    ['Smartphone B', 'Performa', '6'],
                    ['Smartphone B', 'Daya Tahan Baterai', '8'],
                ]
            ]
        ];

        if (!isset($templates[$type])) {
            abort(404);
        }

        $template = $templates[$type];

        return Excel::download(new class($template['headers'], $template['data']) implements \Maatwebsite\Excel\Concerns\FromArray {
            private $headers;
            private $data;

            public function __construct($headers, $data)
            {
                $this->headers = $headers;
                $this->data = $data;
            }

            public function array(): array
            {
                return array_merge([$this->headers], $this->data);
            }
        }, $template['filename']);
    }
}
