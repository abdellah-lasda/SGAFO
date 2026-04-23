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
        Schema::table('plans_formation', function (Blueprint $table) {
            $table->string('plateforme')->nullable()->after('site_formation_id'); // Teams, Zoom, Google Meet, Autre
            $table->string('lien_visio')->nullable()->after('plateforme');        // URL de la conférence
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans_formation', function (Blueprint $table) {
            $table->dropColumn(['plateforme', 'lien_visio']);
        });
    }
};
