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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('ville');
            $table->string('adresse')->nullable();
            $table->string('telephone')->nullable();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->decimal('prix_nuitee', 10, 2)->default(0);
            $table->enum('statut', ['actif', 'archivé'])->default('actif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
