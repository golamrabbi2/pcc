<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\HealthEngine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected HealthEngine $healthEngine,
    ) {}

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $projects = Project::query()
            ->where('owner_id', $user->id)
            ->orWhereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->with(['owner', 'workPackages'])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalPackages = 0;
        $healthCounts = ['green' => 0, 'amber' => 0, 'red' => 0];
        $atRiskItems = [];

        foreach ($projects as $project) {
            foreach ($project->workPackages as $pkg) {
                $totalPackages++;
                $result = $this->healthEngine->evaluate($pkg);
                $healthCounts[$result['status']]++;
                if ($result['status'] === 'red') {
                    $atRiskItems[] = [
                        'package_name' => $pkg->name,
                        'project_name' => $project->name,
                        'project_id' => $project->id,
                        'reason' => $result['reason'],
                    ];
                }
            }
        }

        $atRiskItems = array_slice($atRiskItems, 0, 10);

        $projectSummaries = $projects->map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'status' => $p->status,
            'owner_name' => $p->owner->name,
            'package_count' => $p->workPackages->count(),
            'created_at' => $p->created_at->format('M j, Y'),
        ]);

        $stats = [
            'total_projects' => $projects->count(),
            'active_projects' => $projects->where('status', 'active')->count(),
            'total_packages' => $totalPackages,
            'green' => $healthCounts['green'],
            'amber' => $healthCounts['amber'],
            'red' => $healthCounts['red'],
            'at_risk_count' => count($atRiskItems),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'projects' => $projectSummaries,
            'atRiskItems' => $atRiskItems,
        ]);
    }
}
