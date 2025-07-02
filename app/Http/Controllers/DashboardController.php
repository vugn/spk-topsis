<?php

namespace App\Http\Controllers;

use App\Models\Alternative;
use App\Models\Criterion;
use App\Models\Evaluation;
use App\Models\TopsisResult;
use App\Services\TopsisService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected $topsisService;

    public function __construct(TopsisService $topsisService)
    {
        $this->topsisService = $topsisService;
    }

    public function index(): Response
    {
        $stats = [
            'alternatives_count' => Alternative::count(),
            'criteria_count' => Criterion::count(),
            'evaluations_count' => Evaluation::count(),
            'results_count' => TopsisResult::count(),
        ];

        $topResults = $this->topsisService->getResults()->take(5);
        $recentAlternatives = Alternative::latest()->take(5)->get();
        $recentCriteria = Criterion::latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'topResults' => $topResults,
            'recentAlternatives' => $recentAlternatives,
            'recentCriteria' => $recentCriteria,
        ]);
    }
}
