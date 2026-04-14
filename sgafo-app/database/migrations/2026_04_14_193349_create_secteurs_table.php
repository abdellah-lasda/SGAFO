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
        Schema::create('secteurs', function (Blueprint $row) {
            $row->id();
            $row->string('code', 20)->unique();
            $row->string('nom', 150);
            $row->timestamps();
        });

        Schema::create('secteur_user', function (Blueprint $row) {
            $row->id();
            $row->foreignId('user_id')->constrained()->onDelete('cascade');
            $row->foreignId('secteur_id')->constrained()->onDelete('cascade');
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secteur_user');
        Schema::dropIfExists('secteurs');
    }
};
