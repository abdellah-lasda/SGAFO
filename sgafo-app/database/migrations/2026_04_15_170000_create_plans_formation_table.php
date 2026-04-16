<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans_formation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entite_id')->constrained('entite_formations')->onDelete('cascade');
            $table->string('titre');
            $table->enum('statut', ['brouillon', 'soumis', 'validé', 'rejeté', 'confirmé', 'archivé'])->default('brouillon');
            $table->text('motif_rejet')->nullable();
            $table->foreignId('cree_par')->constrained('users')->onDelete('cascade');
            $table->foreignId('valide_par')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('date_soumission')->nullable();
            $table->timestamp('date_validation')->nullable();
            $table->foreignId('site_formation_id')->nullable()->constrained('sites_formation')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans_formation');
    }
};
