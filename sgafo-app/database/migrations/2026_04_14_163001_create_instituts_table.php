<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instituts', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('code', 50)->unique()->nullable();
            $table->foreignId('region_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instituts');
    }
};
