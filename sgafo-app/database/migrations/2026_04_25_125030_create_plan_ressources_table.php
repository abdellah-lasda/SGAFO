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
        Schema::create('plan_ressources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_formation_id')->constrained('plans_formation')->onDelete('cascade');
            $table->string('titre');
            $table->enum('type', ['file', 'link']);
            $table->string('path');
            $table->string('extension')->nullable();
            $table->integer('size')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_ressources');
    }
};
