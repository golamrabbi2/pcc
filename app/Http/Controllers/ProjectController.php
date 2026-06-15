<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = Project::query()
            ->where('owner_id', $request->user()->id)
            ->orWhereHas('members', fn($q) => $q->where('user_id', $request->user()->id))
            ->with('owner')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = Project::create(array_merge(
            $request->validated(),
            ['owner_id' => $request->user()->id]
        ));

        $project->members()->attach($request->user()->id, ['role' => 'owner']);

        return redirect()->route('projects.show', $project);
    }

    public function show(Project $project): Response
    {
        $project->load('owner');

        $project->load([
            'workPackages' => fn($q) => $q->with('assignee')->orderBy('position')->orderBy('name'),
        ]);

        $packages = $project->workPackages;
        $tree = $this->buildTree($packages);
        $assignableUsers = $project->members()->get()->merge(collect([$project->owner]));

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tree' => $tree,
            'assignableUsers' => $assignableUsers,
        ]);
    }

    private function buildTree($packages, $parentId = null): array
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
                'assignee_id' => $pkg->assignee_id,
                'assignee' => $pkg->assignee ? ['id' => $pkg->assignee->id, 'name' => $pkg->assignee->name] : null,
                'linked_branch' => $pkg->linked_branch,
                'planned_start' => $pkg->planned_start?->format('Y-m-d'),
                'planned_end' => $pkg->planned_end?->format('Y-m-d'),
                'children' => $this->buildTree($packages, $pkg->id),
            ])
            ->toArray();
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(StoreProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($request->validated());

        return redirect()->route('projects.show', $project);
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('projects.index');
    }
}
