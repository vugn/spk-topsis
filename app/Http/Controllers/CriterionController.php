<?php

namespace App\Http\Controllers;

use App\Models\Criterion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CriterionController extends Controller
{
    public function index(): Response
    {
        $criteria = Criterion::withCount('evaluations')->get();
        $totalWeight = Criterion::sum('weight');

        return Inertia::render('Criteria/Index', [
            'criteria' => $criteria,
            'totalWeight' => $totalWeight,
            'remainingWeight' => 1.0 - $totalWeight
        ]);
    }

    public function create(): Response
    {
        $totalWeight = Criterion::sum('weight');
        $remainingWeight = 1.0 - $totalWeight;

        return Inertia::render('Criteria/Create', [
            'totalWeight' => $totalWeight,
            'remainingWeight' => $remainingWeight
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'weight' => 'required|numeric|min:0|max:1',
            'type' => 'required|in:benefit,cost',
        ]);

        // Validasi total bobot tidak boleh melebihi 1.0
        $currentTotalWeight = Criterion::sum('weight');
        $newTotalWeight = $currentTotalWeight + $validated['weight'];

        if ($newTotalWeight > 1.0001) { // Toleransi kecil untuk floating point
            return back()->withErrors([
                'weight' => "Total bobot kriteria akan melebihi 100%. Saat ini: " . number_format($currentTotalWeight * 100, 2) . "%, yang akan ditambahkan: " . number_format($validated['weight'] * 100, 2) . "%. Maksimal yang bisa ditambahkan: " . number_format((1.0 - $currentTotalWeight) * 100, 2) . "%"
            ])->withInput();
        }

        Criterion::create($validated);

        return redirect()->route('criteria.index')
            ->with('success', 'Kriteria berhasil ditambahkan.');
    }

    public function show(Criterion $criterion): Response
    {
        $criterion->load(['evaluations.alternative']);

        return Inertia::render('Criteria/Show', [
            'criterion' => $criterion
        ]);
    }

    public function edit(Criterion $criterion): Response
    {
        $totalWeight = Criterion::where('id', '!=', $criterion->id)->sum('weight');
        $remainingWeight = 1.0 - $totalWeight;

        return Inertia::render('Criteria/Edit', [
            'criterion' => $criterion,
            'totalWeight' => $totalWeight,
            'remainingWeight' => $remainingWeight
        ]);
    }

    public function update(Request $request, Criterion $criterion)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'weight' => 'required|numeric|min:0|max:1',
            'type' => 'required|in:benefit,cost',
        ]);

        // Validasi total bobot tidak boleh melebihi 1.0 (tidak termasuk kriteria yang sedang diupdate)
        $currentTotalWeight = Criterion::where('id', '!=', $criterion->id)->sum('weight');
        $newTotalWeight = $currentTotalWeight + $validated['weight'];

        if ($newTotalWeight > 1.0001) { // Toleransi kecil untuk floating point
            return back()->withErrors([
                'weight' => "Total bobot kriteria akan melebihi 100%. Saat ini (tanpa kriteria ini): " . number_format($currentTotalWeight * 100, 2) . "%, yang akan diset: " . number_format($validated['weight'] * 100, 2) . "%. Maksimal yang bisa diset: " . number_format((1.0 - $currentTotalWeight) * 100, 2) . "%"
            ])->withInput();
        }

        $criterion->update($validated);

        return redirect()->route('criteria.index')
            ->with('success', 'Kriteria berhasil diperbarui.');
    }

    public function destroy(Criterion $criterion)
    {
        $criterion->delete();

        return redirect()->route('criteria.index')
            ->with('success', 'Kriteria berhasil dihapus.');
    }

    /**
     * Validate if the total weight would exceed 1.0
     */
    private function validateTotalWeight($newWeight, $excludeId = null)
    {
        $query = Criterion::query();

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $currentTotalWeight = $query->sum('weight');
        $newTotalWeight = $currentTotalWeight + $newWeight;

        return [
            'isValid' => $newTotalWeight <= 1.0001,
            'currentTotal' => $currentTotalWeight,
            'newTotal' => $newTotalWeight,
            'remaining' => 1.0 - $currentTotalWeight
        ];
    }
}
