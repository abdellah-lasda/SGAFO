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
        Schema::create('entite_themes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entite_id')->constrained('entite_formations')->onDelete('cascade');
            $table->string('titre');
            $table->decimal('duree_heures', 5, 1);
            $table->text('objectifs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entite_themes');
    }
};
