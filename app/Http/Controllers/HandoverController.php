<?php

namespace App\Http\Controllers;

use App\Models\HandoverCapsule;
use App\Models\Project;
use App\Models\WorkPackage;
use App\Services\HandoverGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HandoverController extends Controller
{
    public function __construct(
        protected HandoverGenerator $handoverGenerator,
    ) {}

    public function index(Project $project): Response
    {
        $project->load('owner');

        $capsules = HandoverCapsule::whereIn('work_package_id', $project->workPackages()->pluck('id'))
            ->with(['workPackage', 'generator'])
            ->orderBy('generated_at', 'desc')
            ->get();

        $project->load([
            'workPackages' => fn($q) => $q->with('assignee')->orderBy('position')->orderBy('name'),
        ]);
        $packages = $project->workPackages;
        $tree = $this->buildTree($packages);

        return Inertia::render('Projects/Handover', [
            'project' => $project,
            'capsules' => $capsules,
            'tree' => $tree,
        ]);
    }

    public function generate(Request $request, WorkPackage $workPackage): RedirectResponse
    {
        $data = $this->handoverGenerator->generate(
            $workPackage,
            $request->user()->id,
        );

        $capsule = HandoverCapsule::create($data);

        return redirect()->route('handover.index', $workPackage->project)
            ->with('success', 'Handover capsule generated.');
    }

    public function show(HandoverCapsule $capsule): Response
    {
        $capsule->load(['workPackage', 'generator']);

        return Inertia::render('Projects/HandoverShow', [
            'capsule' => $capsule,
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
                'status' => $pkg->status,
                'children' => $this->buildTree($packages, $pkg->id),
            ])
            ->toArray();
    }
}
