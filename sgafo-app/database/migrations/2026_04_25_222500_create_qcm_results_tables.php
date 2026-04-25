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
        Schema::create('qcm_tentatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('qcm_id')->constrained('qcms')->onDelete('cascade');
            $table->integer('score')->nullable();
            $table->integer('total_points')->nullable();
            $table->timestamp('commence_le')->useCurrent();
            $table->timestamp('termine_le')->nullable();
            $table->integer('duree_secondes')->nullable();
            $table->timestamps();
        });

        Schema::create('qcm_reponses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tentative_id')->constrained('qcm_tentatives')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('qcm_questions')->onDelete('cascade');
            $table->json('options_selectionnees'); // Store as JSON to handle multiple choice
            $table->boolean('est_correcte')->default(false);
            $table->integer('points_obtenus')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qcm_reponses');
        Schema::dropIfExists('qcm_tentatives');
    }
};
