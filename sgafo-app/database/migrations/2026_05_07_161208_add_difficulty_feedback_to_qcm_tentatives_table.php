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
        Schema::table('qcm_tentatives', function (Blueprint $table) {
            $table->enum('difficulty_feedback', ['easy', 'medium', 'hard'])->nullable()->after('duree_secondes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('qcm_tentatives', function (Blueprint $table) {
            $table->dropColumn('difficulty_feedback');
        });
    }
};
