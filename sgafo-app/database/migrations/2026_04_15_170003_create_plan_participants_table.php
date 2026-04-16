<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_participants', function (Blueprint $table) {
            $table->foreignId('plan_id')->constrained('plans_formation')->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('added_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('added_at')->useCurrent();
            $table->primary(['plan_id', 'participant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_participants');
    }
};
