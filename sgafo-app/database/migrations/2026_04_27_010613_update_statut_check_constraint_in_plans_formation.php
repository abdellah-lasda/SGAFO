<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Drop the old CHECK constraint and add one that includes 'annulé'.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE plans_formation DROP CONSTRAINT IF EXISTS plans_formation_statut_check');
        DB::statement("ALTER TABLE plans_formation ADD CONSTRAINT plans_formation_statut_check CHECK (statut IN ('brouillon', 'soumis', 'confirmé', 'rejeté', 'validé', 'annulé'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE plans_formation DROP CONSTRAINT IF EXISTS plans_formation_statut_check');
        DB::statement("ALTER TABLE plans_formation ADD CONSTRAINT plans_formation_statut_check CHECK (statut IN ('brouillon', 'soumis', 'confirmé', 'rejeté', 'validé'))");
    }
};
