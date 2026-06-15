<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\Git\GitServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GitController extends Controller
{
    public function __construct(
        protected GitServiceInterface $git,
    ) {}

    public function repos(): JsonResponse
    {
        $repos = $this->git->getRepositories();
        return response()->json($repos);
    }

    public function branches(Request $request): JsonResponse
    {
        $request->validate(['repo' => 'required|string']);
        [$owner, $repo] = explode('/', $request->repo) + [null, null];
        if (!$owner || !$repo) {
            return response()->json(['error' => 'Invalid repo format. Use owner/repo.'], 422);
        }
        $branches = $this->git->getBranches($owner, $repo);
        return response()->json($branches);
    }

    public function connectRepo(Request $request, Project $project): JsonResponse
    {
        $request->validate([
            'github_repo' => 'required|string',
            'github_owner' => 'required|string',
        ]);

        $project->update([
            'github_repo' => $request->github_repo,
            'github_owner' => $request->github_owner,
        ]);

        return response()->json(['message' => 'Repository connected.']);
    }
}
