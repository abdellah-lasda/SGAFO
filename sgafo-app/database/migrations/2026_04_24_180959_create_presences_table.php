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
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('users')->onDelete('cascade');
            $table->enum('statut', ['présent', 'absent', 'retard'])->default('présent');
            $table->boolean('est_justifie')->default(false);
            $table->text('motif')->nullable();
            $table->time('heure_arrivee')->nullable();
            $table->foreignId('animateur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Un participant ne peut avoir qu'un seul statut par séance
            $table->unique(['seance_id', 'participant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
