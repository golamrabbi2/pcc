<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_packages', function (Blueprint $table) {
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('linked_branch')->nullable();
            $table->date('planned_start')->nullable();
            $table->date('planned_end')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('work_packages', function (Blueprint $table) {
            $table->dropForeign(['assignee_id']);
            $table->dropColumn(['assignee_id', 'linked_branch', 'planned_start', 'planned_end']);
        });
    }
};
