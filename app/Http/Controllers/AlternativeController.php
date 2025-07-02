<?php

namespace App\Http\Controllers;

use App\Models\Alternative;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlternativeController extends Controller
{
    public function index(): Response
    {
        $alternatives = Alternative::withCount('evaluations')->get();

        return Inertia::render('Alternatives/Index', [
            'alternatives' => $alternatives
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Alternatives/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        Alternative::create($validated);

        return redirect()->route('alternatives.index')
            ->with('success', 'Alternatif berhasil ditambahkan.');
    }

    public function show(Alternative $alternative): Response
    {
        $alternative->load(['evaluations.criterion']);

        return Inertia::render('Alternatives/Show', [
            'alternative' => $alternative
        ]);
    }

    public function edit(Alternative $alternative): Response
    {
        return Inertia::render('Alternatives/Edit', [
            'alternative' => $alternative
        ]);
    }

    public function update(Request $request, Alternative $alternative)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $alternative->update($validated);

        return redirect()->route('alternatives.index')
            ->with('success', 'Alternatif berhasil diperbarui.');
    }

    public function destroy(Alternative $alternative)
    {
        $alternative->delete();

        return redirect()->route('alternatives.index')
            ->with('success', 'Alternatif berhasil dihapus.');
    }
}
