<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_themes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans_formation')->onDelete('cascade');
            $table->string('nom');
            $table->decimal('duree_heures', 5, 1);
            $table->text('objectifs')->nullable();
            $table->integer('ordre')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_themes');
    }
};
