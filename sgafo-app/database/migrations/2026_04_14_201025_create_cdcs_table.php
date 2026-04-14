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
        Schema::create('cdcs', function (Blueprint $row) {
            $row->id();
            $row->string('code', 20)->unique();
            $row->string('nom', 200);
            $row->timestamps();
        });

        Schema::create('cdc_user', function (Blueprint $row) {
            $row->id();
            $row->foreignId('user_id')->constrained()->onDelete('cascade');
            $row->foreignId('cdc_id')->constrained()->onDelete('cascade');
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cdc_user');
        Schema::dropIfExists('cdcs');
    }
};
