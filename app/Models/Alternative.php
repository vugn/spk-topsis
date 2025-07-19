<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Alternative extends Model
{
    protected $fillable = [
        'name',
        'description',
        'evidence_files',
        'evidence_updated_at',
    ];

    protected $casts = [
        'evidence_files' => 'array',
        'evidence_updated_at' => 'datetime',
    ];

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    public function topsisResults(): HasMany
    {
        return $this->hasMany(TopsisResult::class);
    }

    /**
     * Get the evidence files with full URL
     */
    public function getEvidenceFilesWithUrlAttribute()
    {
        if (!$this->evidence_files) {
            return [];
        }

        return collect($this->evidence_files)->map(function ($file) {
            return [
                'name' => $file['name'],
                'original_name' => $file['original_name'],
                'size' => $file['size'],
                'mime_type' => $file['mime_type'],
                'url' => asset('storage/evidence/' . $file['name']),
                'uploaded_at' => $file['uploaded_at'] ?? null,
            ];
        })->toArray();
    }

    /**
     * Check if alternative has evidence files
     */
    public function hasEvidenceFiles(): bool
    {
        return !empty($this->evidence_files);
    }

    /**
     * Get evidence files count
     */
    public function getEvidenceFilesCountAttribute(): int
    {
        return $this->evidence_files ? count($this->evidence_files) : 0;
    }
}
