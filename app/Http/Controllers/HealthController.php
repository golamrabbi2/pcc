<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\WorkPackage;
use App\Services\HealthEngine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HealthController extends Controller
{
    public function __construct(
        protected HealthEngine $healthEngine,
    ) {}

    public function show(Project $project): Response
    {
        $project->load('owner');

        $project->load([
            'workPackages' => fn($q) => $q->with('assignee')->orderBy('position')->orderBy('name'),
        ]);

        $healthResults = [];
        foreach ($project->workPackages as $pkg) {
            $result = $this->healthEngine->evaluate($pkg);
            $healthResults[$pkg->id] = $result;
        }

        $packages = $project->workPackages;
        $tree = $this->buildTree($packages, $healthResults);

        $summary = $this->summarize($healthResults);

        return Inertia::render('Projects/Health', [
            'project' => $project,
            'tree' => $tree,
            'summary' => $summary,
        ]);
    }

    public function refresh(Project $project): RedirectResponse
    {
        $project->load('workPackages');

        foreach ($project->workPackages as $pkg) {
            $result = $this->healthEngine->evaluate($pkg);
            $pkg->healthLogs()->create([
                'status' => $result['status'],
                'reason' => $result['reason'],
                'metrics' => $result['metrics'],
                'checked_at' => $result['checked_at'],
            ]);
        }

        return redirect()->route('health.show', $project)
            ->with('success', 'Health check refreshed.');
    }

    private function buildTree($packages, array $healthResults, $parentId = null): array
    {
        return $packages
            ->where('parent_id', $parentId)
            ->values()
            ->map(fn($pkg) => [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'description' => $pkg->description,
                'status' => $pkg->status,
                'position' => $pkg->position,
                'assignee' => $pkg->assignee ? ['id' => $pkg->assignee->id, 'name' => $pkg->assignee->name] : null,
                'linked_branch' => $pkg->linked_branch,
                'planned_start' => $pkg->planned_start?->format('Y-m-d'),
                'planned_end' => $pkg->planned_end?->format('Y-m-d'),
                'health' => $healthResults[$pkg->id] ?? ['status' => 'amber', 'reason' => 'Not checked'],
                'children' => $this->buildTree($packages, $healthResults, $pkg->id),
            ])
            ->toArray();
    }

    private function summarize(array $results): array
    {
        $counts = ['green' => 0, 'amber' => 0, 'red' => 0];
        foreach ($results as $r) {
            $counts[$r['status']]++;
        }
        return $counts;
    }
}
