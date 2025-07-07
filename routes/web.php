<?php

use App\Http\Controllers\AlternativeController;
use App\Http\Controllers\CriterionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\TopsisController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Resource routes
    Route::resource('alternatives', AlternativeController::class);
    Route::resource('criteria', CriterionController::class);
    Route::resource('evaluations', EvaluationController::class);

    // Bulk evaluation store
    Route::post('evaluations/bulk', [EvaluationController::class, 'bulkStore'])->name('evaluations.bulk');

    // TOPSIS routes
    Route::get('topsis', [TopsisController::class, 'index'])->name('topsis.index');
    Route::post('topsis/calculate', [TopsisController::class, 'calculate'])->name('topsis.calculate');
    Route::get('topsis/charts', [TopsisController::class, 'charts'])->name('topsis.charts');

    // Import routes
    Route::get('import', [ImportController::class, 'index'])->name('import.index');
    Route::post('import/alternatives', [ImportController::class, 'importAlternatives'])->name('import.alternatives');
    Route::post('import/criteria', [ImportController::class, 'importCriteria'])->name('import.criteria');
    Route::post('import/evaluations', [ImportController::class, 'importEvaluations'])->name('import.evaluations');
    Route::get('import/template/{type}', [ImportController::class, 'downloadTemplate'])->name('import.template');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
