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
        Schema::create('entite_formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->enum('type', ['technique', 'pedagogique', 'manageriale', 'transversale']);
            $table->enum('mode', ['présentiel', 'distance', 'hybride']);
            $table->foreignId('secteur_id')->constrained('secteurs')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->text('objectifs');
            $table->enum('statut', ['actif', 'archivé'])->default('actif');
            $table->foreignId('cree_par_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entite_formations');
    }
};
