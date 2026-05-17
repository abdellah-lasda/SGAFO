<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attestations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans_formation')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['participant', 'animateur']);
            $table->string('file_path')->nullable();
            $table->uuid('download_token')->unique();
            $table->timestamp('downloaded_at')->nullable();
            $table->timestamps();

            $table->unique(['plan_id', 'user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attestations');
    }
};
