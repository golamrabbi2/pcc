<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'description', 'status', 'github_repo'];

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            $project->uuid = (string) Str::uuid();
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function workPackages(): HasMany
    {
        return $this->hasMany(WorkPackage::class);
    }

    public function rootWorkPackages(): HasMany
    {
        return $this->hasMany(WorkPackage::class)->whereNull('parent_id');
    }
}
