<?php

namespace App\Imports;

use App\Models\Alternative;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;

class AlternativesImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use Importable, SkipsErrors, SkipsFailures;

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Alternative([
            'name' => $row['nama'] ?? $row['name'] ?? '',
            'description' => $row['deskripsi'] ?? $row['description'] ?? '',
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
        ];
    }

    /**
     * @return array
     */
    public function customValidationMessages()
    {
        return [
            'nama.required' => 'Nama alternatif wajib diisi.',
            'nama.string' => 'Nama alternatif harus berupa teks.',
            'nama.max' => 'Nama alternatif maksimal 255 karakter.',
        ];
    }
}
