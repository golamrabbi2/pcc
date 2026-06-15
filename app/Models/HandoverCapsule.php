<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandoverCapsule extends Model
{
    use HasFactory;

    protected $fillable = ['work_package_id', 'generated_by', 'content', 'pr_url', 'pr_branch', 'pr_status', 'generated_at'];

    protected function casts(): array
    {
        return [
            'generated_at' => 'datetime',
        ];
    }

    public function workPackage(): BelongsTo
    {
        return $this->belongsTo(WorkPackage::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
