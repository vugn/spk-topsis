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
        Schema::table('alternatives', function (Blueprint $table) {
            $table->json('evidence_files')->nullable()->after('description');
            $table->timestamp('evidence_updated_at')->nullable()->after('evidence_files');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alternatives', function (Blueprint $table) {
            $table->dropColumn(['evidence_files', 'evidence_updated_at']);
        });
    }
};
