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
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans_formation')->onDelete('cascade');
            $table->foreignId('site_id')->constrained('sites_formation')->onDelete('cascade');
            $table->date('date');
            $table->time('debut');
            $table->time('fin');
            $table->enum('statut', ['planifiée', 'terminée', 'annulée'])->default('planifiée');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seances');
    }
};
