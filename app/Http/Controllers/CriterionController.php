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

        return Inertia::render('Criteria/Index', [
            'criteria' => $criteria
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Criteria/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'weight' => 'required|numeric|min:0|max:1',
            'type' => 'required|in:benefit,cost',
        ]);

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
        return Inertia::render('Criteria/Edit', [
            'criterion' => $criterion
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
}
