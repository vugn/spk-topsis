<?php

namespace App\Http\Controllers;

use App\Services\TopsisService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopsisController extends Controller
{
    protected $topsisService;

    public function __construct(TopsisService $topsisService)
    {
        $this->topsisService = $topsisService;
    }

    public function index(): Response
    {
        $results = $this->topsisService->getResults();

        return Inertia::render('Topsis/Index', [
            'results' => $results
        ]);
    }

    public function calculate()
    {
        try {
            $results = $this->topsisService->calculateTopsis();

            return redirect()->route('topsis.index')
                ->with('success', 'Perhitungan TOPSIS berhasil dilakukan.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function charts(): Response
    {
        $results = $this->topsisService->getResults();

        return Inertia::render('Topsis/Charts', [
            'results' => $results
        ]);
    }
}
