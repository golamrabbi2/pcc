<?php

namespace App\Models;

use Database\Factories\HealthLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthLog extends Model
{
    /** @use HasFactory<HealthLogFactory> */
    use HasFactory;

    protected $fillable = ['work_package_id', 'status', 'reason', 'metrics', 'checked_at'];

    protected function casts(): array
    {
        return [
            'metrics' => 'array',
            'checked_at' => 'datetime',
        ];
    }

    public function workPackage(): BelongsTo
    {
        return $this->belongsTo(WorkPackage::class);
    }
}
