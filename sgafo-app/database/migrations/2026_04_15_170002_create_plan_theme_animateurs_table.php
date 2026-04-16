<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_theme_animateurs', function (Blueprint $table) {
            $table->foreignId('theme_id')->constrained('plan_themes')->onDelete('cascade');
            $table->foreignId('animateur_id')->constrained('users')->onDelete('cascade');
            $table->primary(['theme_id', 'animateur_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_theme_animateurs');
    }
};
