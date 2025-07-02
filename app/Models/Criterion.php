<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Criterion extends Model
{
    protected $fillable = [
        'name',
        'description',
        'weight',
        'type',
    ];

    protected $casts = [
        'weight' => 'decimal:4',
    ];

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }
}
