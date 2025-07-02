<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TopsisResult extends Model
{
    protected $fillable = [
        'alternative_id',
        'distance_positive',
        'distance_negative',
        'preference_score',
        'rank',
    ];

    protected $casts = [
        'distance_positive' => 'decimal:8',
        'distance_negative' => 'decimal:8',
        'preference_score' => 'decimal:8',
    ];

    public function alternative(): BelongsTo
    {
        return $this->belongsTo(Alternative::class);
    }
}
