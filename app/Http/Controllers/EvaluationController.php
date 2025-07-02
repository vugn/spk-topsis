<?php

namespace App\Http\Controllers;

use App\Models\Alternative;
use App\Models\Criterion;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    public function index(): Response
    {
        $alternatives = Alternative::with(['evaluations.criterion'])->get();
        $criteria = Criterion::all();

        return Inertia::render('Evaluations/Index', [
            'alternatives' => $alternatives,
            'criteria' => $criteria
        ]);
    }

    public function create(): Response
    {
        $alternatives = Alternative::all();
        $criteria = Criterion::all();

        return Inertia::render('Evaluations/Create', [
            'alternatives' => $alternatives,
            'criteria' => $criteria
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'alternative_id' => 'required|exists:alternatives,id',
            'criterion_id' => 'required|exists:criteria,id',
            'value' => 'required|numeric|min:0',
        ]);

        Evaluation::updateOrCreate(
            [
                'alternative_id' => $validated['alternative_id'],
                'criterion_id' => $validated['criterion_id']
            ],
            ['value' => $validated['value']]
        );

        return redirect()->route('evaluations.index')
            ->with('success', 'Evaluasi berhasil disimpan.');
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'evaluations' => 'required|array',
            'evaluations.*.alternative_id' => 'required|exists:alternatives,id',
            'evaluations.*.criterion_id' => 'required|exists:criteria,id',
            'evaluations.*.value' => 'required|numeric|min:0',
        ]);

        foreach ($validated['evaluations'] as $evaluation) {
            Evaluation::updateOrCreate(
                [
                    'alternative_id' => $evaluation['alternative_id'],
                    'criterion_id' => $evaluation['criterion_id']
                ],
                ['value' => $evaluation['value']]
            );
        }

        return redirect()->route('evaluations.index')
            ->with('success', 'Semua evaluasi berhasil disimpan.');
    }

    public function edit(Evaluation $evaluation): Response
    {
        $alternatives = Alternative::all();
        $criteria = Criterion::all();

        return Inertia::render('Evaluations/Edit', [
            'evaluation' => $evaluation,
            'alternatives' => $alternatives,
            'criteria' => $criteria
        ]);
    }

    public function update(Request $request, Evaluation $evaluation)
    {
        $validated = $request->validate([
            'value' => 'required|numeric|min:0',
        ]);

        $evaluation->update($validated);

        return redirect()->route('evaluations.index')
            ->with('success', 'Evaluasi berhasil diperbarui.');
    }

    public function destroy(Evaluation $evaluation)
    {
        $evaluation->delete();

        return redirect()->route('evaluations.index')
            ->with('success', 'Evaluasi berhasil dihapus.');
    }
}
