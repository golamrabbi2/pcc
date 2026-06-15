<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkPackageRequest;
use App\Models\Project;
use App\Models\WorkPackage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WbsController extends Controller
{
    public function store(StoreWorkPackageRequest $request, Project $project): RedirectResponse
    {
        $package = $project->workPackages()->create($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Work package created.');
    }

    public function update(StoreWorkPackageRequest $request, WorkPackage $workPackage): RedirectResponse
    {
        $workPackage->update($request->validated());

        return redirect()->route('projects.show', $workPackage->project)
            ->with('success', 'Work package updated.');
    }

    public function patch(Request $request, WorkPackage $workPackage): RedirectResponse
    {
        $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:todo,in_progress,done,blocked'],
            'description' => ['nullable', 'string', 'max:5000'],
            'assignee_id' => ['nullable', 'exists:users,id'],
            'linked_branch' => ['nullable', 'string', 'max:255'],
            'planned_start' => ['nullable', 'date'],
            'planned_end' => ['nullable', 'date'],
        ]);

        $workPackage->update($request->only([
            'name', 'status', 'description', 'assignee_id',
            'linked_branch', 'planned_start', 'planned_end',
        ]));

        return redirect()->route('projects.show', $workPackage->project)
            ->with('success', 'Work package updated.');
    }

    public function destroy(WorkPackage $workPackage): RedirectResponse
    {
        $project = $workPackage->project;
        $workPackage->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Work package deleted.');
    }

    public function reorder(Request $request, Project $project): RedirectResponse
    {
        $request->validate([
            'packages' => 'required|array',
            'packages.*.id' => 'required|exists:work_packages,id',
            'packages.*.position' => 'required|integer|min:0',
            'packages.*.parent_id' => 'nullable|exists:work_packages,id',
        ]);

        foreach ($request->packages as $item) {
            WorkPackage::where('id', $item['id'])
                ->where('project_id', $project->id)
                ->update([
                    'position' => $item['position'],
                    'parent_id' => $item['parent_id'] ?? null,
                ]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Work packages reordered.');
    }
}
