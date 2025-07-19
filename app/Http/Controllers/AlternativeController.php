<?php

namespace App\Http\Controllers;

use App\Models\Alternative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AlternativeController extends Controller
{
    public function index(): Response
    {
        $alternatives = Alternative::withCount('evaluations')
            ->get()
            ->map(function ($alternative) {
                $alternative->evidence_files_count = $alternative->evidence_files_count;
                $alternative->evidence_files_with_url = $alternative->evidence_files_with_url;
                return $alternative;
            });

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
            'alternative' => $alternative,
            'evidenceFiles' => $alternative->getEvidenceFilesWithUrlAttribute()
        ]);
    }

    public function edit(Alternative $alternative): Response
    {
        return Inertia::render('Alternatives/Edit', [
            'alternative' => $alternative,
            'evidenceFiles' => $alternative->getEvidenceFilesWithUrlAttribute()
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
        // Delete associated evidence files
        $this->deleteEvidenceFiles($alternative);

        $alternative->delete();

        return redirect()->route('alternatives.index')
            ->with('success', 'Alternatif berhasil dihapus.');
    }

    /**
     * Upload evidence files for an alternative
     */
    public function uploadEvidence(Request $request, Alternative $alternative)
    {
        $request->validate([
            'files' => 'required|array|max:5',
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:5120', // Max 5MB per file
        ]);

        $uploadedFiles = [];
        $currentFiles = $alternative->evidence_files ?? [];

        // Check total files limit (max 5 files per alternative)
        if (count($currentFiles) + count($request->file('files')) > 5) {
            return back()->withErrors([
                'files' => 'Maksimal 5 file bukti per alternatif. Saat ini: ' . count($currentFiles) . ' file.'
            ]);
        }

        foreach ($request->file('files') as $file) {
            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('evidence', $fileName, 'public');

            $uploadedFiles[] = [
                'name' => $fileName,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'uploaded_at' => now()->toISOString(),
            ];
        }

        // Merge with existing files
        $allFiles = array_merge($currentFiles, $uploadedFiles);

        $alternative->update([
            'evidence_files' => $allFiles,
            'evidence_updated_at' => now(),
        ]);

        return back()->with('success', count($uploadedFiles) . ' file bukti berhasil diupload.');
    }

    /**
     * Delete a specific evidence file
     */
    public function deleteEvidence(Request $request, Alternative $alternative)
    {
        $request->validate([
            'file_name' => 'required|string'
        ]);

        $currentFiles = $alternative->evidence_files ?? [];
        $fileName = $request->file_name;

        // Find and remove the file from array
        $updatedFiles = array_filter($currentFiles, function ($file) use ($fileName) {
            return $file['name'] !== $fileName;
        });

        // Delete physical file
        Storage::disk('public')->delete('evidence/' . $fileName);

        $alternative->update([
            'evidence_files' => array_values($updatedFiles),
            'evidence_updated_at' => now(),
        ]);

        return back()->with('success', 'File bukti berhasil dihapus.');
    }

    /**
     * Download evidence file
     */
    public function downloadEvidence(Alternative $alternative, $fileName)
    {
        $currentFiles = $alternative->evidence_files ?? [];

        // Check if file exists in the alternative's files
        $fileData = collect($currentFiles)->firstWhere('name', $fileName);

        if (!$fileData) {
            abort(404, 'File tidak ditemukan.');
        }

        $filePath = 'evidence/' . $fileName;

        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'File tidak ditemukan di storage.');
        }

        return response()->download(
            Storage::disk('public')->path($filePath),
            $fileData['original_name']
        );
    }

    /**
     * Delete all evidence files for an alternative
     */
    private function deleteEvidenceFiles(Alternative $alternative)
    {
        if ($alternative->evidence_files) {
            foreach ($alternative->evidence_files as $file) {
                Storage::disk('public')->delete('evidence/' . $file['name']);
            }
        }
    }
}
