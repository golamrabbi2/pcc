<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkPackage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id', 'parent_id', 'name', 'description',
        'status', 'position', 'assignee_id', 'linked_branch',
        'planned_start', 'planned_end',
    ];

    protected function casts(): array
    {
        return [
            'planned_start' => 'date',
            'planned_end' => 'date',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(WorkPackage::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(WorkPackage::class, 'parent_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function healthLogs(): HasMany
    {
        return $this->hasMany(HealthLog::class)->latest('checked_at');
    }

    public function latestHealth()
    {
        return $this->hasOne(HealthLog::class)->latest('checked_at');
    }
}
