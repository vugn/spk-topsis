<?php

namespace App\Imports;

use App\Models\Alternative;
use App\Models\Criterion;
use App\Models\Evaluation;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;

class EvaluationsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use Importable, SkipsErrors, SkipsFailures;

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Find alternative by name
        $alternativeName = $row['alternatif'] ?? $row['alternative'] ?? '';
        $alternative = Alternative::where('name', $alternativeName)->first();

        if (!$alternative) {
            return null;
        }

        // Find criterion by name
        $criterionName = $row['kriteria'] ?? $row['criterion'] ?? '';
        $criterion = Criterion::where('name', $criterionName)->first();

        if (!$criterion) {
            return null;
        }

        // Parse value
        $value = $row['nilai'] ?? $row['value'] ?? 0;
        if (is_string($value)) {
            $value = (float) str_replace(',', '.', $value);
        }

        // Check if evaluation already exists
        $existingEvaluation = Evaluation::where('alternative_id', $alternative->id)
            ->where('criterion_id', $criterion->id)
            ->first();

        if ($existingEvaluation) {
            // Update existing evaluation
            $existingEvaluation->update(['value' => $value]);
            return null; // Don't create new model
        }

        return new Evaluation([
            'alternative_id' => $alternative->id,
            'criterion_id' => $criterion->id,
            'value' => $value,
        ]);
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'alternatif' => 'required|string',
            'kriteria' => 'required|string',
            'nilai' => 'required|numeric|min:0',
        ];
    }

    /**
     * @return array
     */
    public function customValidationMessages()
    {
        return [
            'alternatif.required' => 'Nama alternatif wajib diisi.',
            'kriteria.required' => 'Nama kriteria wajib diisi.',
            'nilai.required' => 'Nilai evaluasi wajib diisi.',
            'nilai.numeric' => 'Nilai evaluasi harus berupa angka.',
            'nilai.min' => 'Nilai evaluasi minimal 0.',
        ];
    }
}
