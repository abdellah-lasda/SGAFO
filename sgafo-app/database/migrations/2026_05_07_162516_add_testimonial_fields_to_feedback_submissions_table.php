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
        Schema::table('feedback_submissions', function (Blueprint $table) {
            $table->boolean('is_testimonial')->default(false)->after('est_affiche_sur_plan');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->nullOnDelete()->after('is_testimonial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedback_submissions', function (Blueprint $table) {
            $table->dropForeign(['moderated_by']);
            $table->dropColumn(['is_testimonial', 'moderated_by']);
        });
    }
};
