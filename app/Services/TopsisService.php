<?php

namespace App\Services;

use App\Models\Alternative;
use App\Models\Criterion;
use App\Models\Evaluation;
use App\Models\TopsisResult;
use Illuminate\Support\Collection;

class TopsisService
{
    public function calculateTopsis(): array
    {
        // Hapus hasil sebelumnya
        TopsisResult::truncate();

        // Ambil semua alternatif dan kriteria
        $alternatives = Alternative::all();
        $criteria = Criterion::all();

        if ($alternatives->isEmpty() || $criteria->isEmpty()) {
            return [];
        }

        // Validasi bobot kriteria harus berjumlah 1
        $totalWeight = $criteria->sum('weight');
        if (abs($totalWeight - 1.0) > 0.001) {
            throw new \Exception("Total bobot kriteria harus sama dengan 1.0. Saat ini: " . number_format($totalWeight, 4));
        }

        // Pastikan ada evaluasi
        $evaluationCount = Evaluation::count();
        if ($evaluationCount === 0) {
            throw new \Exception("Tidak ada data evaluasi. Silakan input evaluasi terlebih dahulu.");
        }

        // Buat decision matrix
        $decisionMatrix = $this->createDecisionMatrix($alternatives, $criteria);

        // Validasi matrix tidak kosong
        if (empty($decisionMatrix) || empty($decisionMatrix[0])) {
            throw new \Exception("Decision matrix kosong. Pastikan semua evaluasi telah diinput.");
        }

        // Normalisasi matrix
        $normalizedMatrix = $this->normalizeMatrix($decisionMatrix, $criteria);

        // Hitung weighted normalized matrix
        $weightedMatrix = $this->calculateWeightedMatrix($normalizedMatrix, $criteria);

        // Tentukan solusi ideal positif dan negatif
        $idealPositive = $this->calculateIdealPositive($weightedMatrix, $criteria);
        $idealNegative = $this->calculateIdealNegative($weightedMatrix, $criteria);

        // Hitung jarak dari solusi ideal
        $distances = $this->calculateDistances($weightedMatrix, $idealPositive, $idealNegative, $alternatives);

        // Hitung preference score dan ranking
        $results = $this->calculatePreferenceScores($distances, $alternatives);

        // Simpan hasil ke database
        $this->saveResults($results);

        return $results;
    }

    private function createDecisionMatrix(Collection $alternatives, Collection $criteria): array
    {
        $matrix = [];

        foreach ($alternatives as $alternative) {
            $row = [];
            foreach ($criteria as $criterion) {
                $evaluation = Evaluation::where('alternative_id', $alternative->id)
                    ->where('criterion_id', $criterion->id)
                    ->first();

                if (!$evaluation) {
                    throw new \Exception("Evaluasi tidak ditemukan untuk alternatif '{$alternative->name}' pada kriteria '{$criterion->name}'. Pastikan semua evaluasi telah diinput.");
                }

                $row[] = (float) $evaluation->value;
            }
            $matrix[] = $row;
        }

        return $matrix;
    }

    private function normalizeMatrix(array $matrix, Collection $criteria): array
    {
        $normalizedMatrix = [];
        $criteriaCount = count($criteria);

        // Hitung sum of squares untuk setiap kolom
        $sumOfSquares = array_fill(0, $criteriaCount, 0);

        foreach ($matrix as $row) {
            for ($j = 0; $j < $criteriaCount; $j++) {
                $sumOfSquares[$j] += pow($row[$j], 2);
            }
        }

        // Normalisasi setiap elemen
        foreach ($matrix as $row) {
            $normalizedRow = [];
            for ($j = 0; $j < $criteriaCount; $j++) {
                $normalizedRow[] = $sumOfSquares[$j] > 0 ? $row[$j] / sqrt($sumOfSquares[$j]) : 0;
            }
            $normalizedMatrix[] = $normalizedRow;
        }

        return $normalizedMatrix;
    }

    private function calculateWeightedMatrix(array $normalizedMatrix, Collection $criteria): array
    {
        $weightedMatrix = [];
        $weights = $criteria->pluck('weight')->toArray();

        foreach ($normalizedMatrix as $row) {
            $weightedRow = [];
            for ($j = 0; $j < count($weights); $j++) {
                $weightedRow[] = $row[$j] * $weights[$j];
            }
            $weightedMatrix[] = $weightedRow;
        }

        return $weightedMatrix;
    }

    private function calculateIdealPositive(array $weightedMatrix, Collection $criteria): array
    {
        $idealPositive = [];
        $criteriaArray = $criteria->toArray();

        for ($j = 0; $j < count($criteriaArray); $j++) {
            $column = array_column($weightedMatrix, $j);

            if ($criteriaArray[$j]['type'] === 'benefit') {
                $idealPositive[] = max($column);
            } else {
                $idealPositive[] = min($column);
            }
        }

        return $idealPositive;
    }

    private function calculateIdealNegative(array $weightedMatrix, Collection $criteria): array
    {
        $idealNegative = [];
        $criteriaArray = $criteria->toArray();

        for ($j = 0; $j < count($criteriaArray); $j++) {
            $column = array_column($weightedMatrix, $j);

            if ($criteriaArray[$j]['type'] === 'benefit') {
                $idealNegative[] = min($column);
            } else {
                $idealNegative[] = max($column);
            }
        }

        return $idealNegative;
    }

    private function calculateDistances(array $weightedMatrix, array $idealPositive, array $idealNegative, Collection $alternatives): array
    {
        $distances = [];

        foreach ($weightedMatrix as $i => $row) {
            $distancePositive = 0;
            $distanceNegative = 0;

            for ($j = 0; $j < count($row); $j++) {
                $distancePositive += pow($row[$j] - $idealPositive[$j], 2);
                $distanceNegative += pow($row[$j] - $idealNegative[$j], 2);
            }

            $distances[] = [
                'alternative_id' => $alternatives[$i]->id,
                'distance_positive' => sqrt($distancePositive),
                'distance_negative' => sqrt($distanceNegative),
            ];
        }

        return $distances;
    }

    private function calculatePreferenceScores(array $distances, Collection $alternatives): array
    {
        $results = [];

        foreach ($distances as $distance) {
            $totalDistance = $distance['distance_positive'] + $distance['distance_negative'];
            $preferenceScore = $totalDistance > 0 ? $distance['distance_negative'] / $totalDistance : 0;

            $results[] = [
                'alternative_id' => $distance['alternative_id'],
                'distance_positive' => $distance['distance_positive'],
                'distance_negative' => $distance['distance_negative'],
                'preference_score' => $preferenceScore,
            ];
        }

        // Urutkan berdasarkan preference score (descending)
        usort($results, function ($a, $b) {
            return $b['preference_score'] <=> $a['preference_score'];
        });

        // Tambahkan ranking
        foreach ($results as $index => &$result) {
            $result['rank'] = $index + 1;
        }

        return $results;
    }

    private function saveResults(array $results): void
    {
        foreach ($results as $result) {
            TopsisResult::create($result);
        }
    }

    public function getResults(): Collection
    {
        return TopsisResult::with('alternative')
            ->orderBy('rank')
            ->get();
    }
}
