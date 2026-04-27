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
        Schema::create('feedback_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->onDelete('cascade');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('feedback_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_form_id')->constrained('feedback_forms')->onDelete('cascade');
            $table->text('question_text');
            $table->enum('type', ['rating', 'text'])->default('rating');
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });

        Schema::create('feedback_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_form_id')->constrained('feedback_forms')->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('plans_formation')->onDelete('cascade');
            $table->foreignId('seance_id')->constrained('seances')->onDelete('cascade');
            $table->text('commentaire_general')->nullable();
            $table->boolean('est_affiche_sur_plan')->default(false);
            $table->timestamps();

            $table->unique(['feedback_form_id', 'participant_id'], 'unique_participant_feedback');
        });

        Schema::create('feedback_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_submission_id')->constrained('feedback_submissions')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('feedback_questions')->onDelete('cascade');
            $table->integer('rating')->nullable();
            $table->text('answer_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_responses');
        Schema::dropIfExists('feedback_submissions');
        Schema::dropIfExists('feedback_questions');
        Schema::dropIfExists('feedback_forms');
    }
};
