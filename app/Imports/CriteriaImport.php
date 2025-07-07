<?php

namespace App\Imports;

use App\Models\Criterion;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;

class CriteriaImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use Importable, SkipsErrors, SkipsFailures;

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Normalize weight value
        $weight = $row['bobot'] ?? $row['weight'] ?? 0;
        if (is_string($weight)) {
            $weight = (float) str_replace(',', '.', $weight);
        }

        // Normalize type value
        $type = strtolower($row['tipe'] ?? $row['type'] ?? 'benefit');
        $type = ($type === 'cost' || $type === 'biaya') ? 'cost' : 'benefit';

        return new Criterion([
            'name' => $row['nama'] ?? $row['name'] ?? '',
            'description' => $row['deskripsi'] ?? $row['description'] ?? '',
            'weight' => $weight,
            'type' => $type,
        ]);
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'bobot' => 'required|numeric|min:0|max:1',
            'tipe' => 'required|in:benefit,cost,biaya',
        ];
    }

    /**
     * @return array
     */
    public function customValidationMessages()
    {
        return [
            'nama.required' => 'Nama kriteria wajib diisi.',
            'nama.string' => 'Nama kriteria harus berupa teks.',
            'nama.max' => 'Nama kriteria maksimal 255 karakter.',
            'bobot.required' => 'Bobot kriteria wajib diisi.',
            'bobot.numeric' => 'Bobot kriteria harus berupa angka.',
            'bobot.min' => 'Bobot kriteria minimal 0.',
            'bobot.max' => 'Bobot kriteria maksimal 1.',
            'tipe.required' => 'Tipe kriteria wajib diisi.',
            'tipe.in' => 'Tipe kriteria harus benefit atau cost.',
        ];
    }
}
