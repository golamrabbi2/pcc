<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('handover_capsules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('generated_by')->constrained('users');
            $table->longText('content');
            $table->string('pr_url')->nullable();
            $table->string('pr_branch')->nullable();
            $table->string('pr_status')->default('draft');
            $table->timestamp('generated_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('handover_capsules');
    }
};
