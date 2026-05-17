<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attestation_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->nullable()->constrained('plans_formation')->onDelete('cascade');
            $table->enum('type', ['participant', 'animateur']);
            $table->longText('html_content');
            $table->longText('css_content');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['plan_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attestation_templates');
    }
};
