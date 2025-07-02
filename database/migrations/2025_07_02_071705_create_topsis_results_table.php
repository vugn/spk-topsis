<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('topsis_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alternative_id')->constrained()->onDelete('cascade');
            $table->decimal('distance_positive', 10, 8); // Jarak ke solusi ideal positif
            $table->decimal('distance_negative', 10, 8); // Jarak ke solusi ideal negatif
            $table->decimal('preference_score', 10, 8); // Skor preferensi (0-1)
            $table->integer('rank'); // Peringkat
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topsis_results');
    }
};
