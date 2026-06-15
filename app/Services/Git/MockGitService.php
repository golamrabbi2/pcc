<?php

namespace App\Services\Git;

class MockGitService implements GitServiceInterface
{
    public function getBranches(string $owner, string $repo): array
    {
        return [
            ['name' => 'main', 'sha' => 'abc123'],
            ['name' => 'develop', 'sha' => 'def456'],
            ['name' => 'feature/wbs-auth', 'sha' => 'ghi789'],
            ['name' => 'feature/dashboard-ui', 'sha' => 'jkl012'],
            ['name' => 'bugfix/health-engine', 'sha' => 'mno345'],
        ];
    }

    public function getCommits(string $owner, string $repo, string $branch, int $limit = 10): array
    {
        return [
            ['sha' => 'abc123', 'message' => 'feat: implement auth flow', 'author' => 'dev1', 'date' => now()->subDays(2)->toIso8601String()],
            ['sha' => 'def456', 'message' => 'fix: resolve login redirect', 'author' => 'dev2', 'date' => now()->subDay()->toIso8601String()],
            ['sha' => 'ghi789', 'message' => 'feat: add WBS tree component', 'author' => 'dev1', 'date' => now()->subHours(6)->toIso8601String()],
        ];
    }

    public function createPullRequest(string $owner, string $repo, string $title, string $body, string $head, string $base = 'main'): array
    {
        return [
            'url' => "https://github.com/{$owner}/{$repo}/pull/{$head}",
            'number' => rand(1, 999),
            'state' => 'open',
        ];
    }

    public function getRepositories(): array
    {
        return [
            ['full_name' => 'golamrabbi2/pcc', 'name' => 'pcc', 'owner' => 'golamrabbi2'],
            ['full_name' => 'golamrabbi2/sample-app', 'name' => 'sample-app', 'owner' => 'golamrabbi2'],
            ['full_name' => 'golamrabbi2/api-service', 'name' => 'api-service', 'owner' => 'golamrabbi2'],
        ];
    }

    public function verifyWebhookSignature(string $payload, string $signature, string $secret): bool
    {
        return hash_equals($signature, 'sha256=' . hash_hmac('sha256', $payload, $secret));
    }
}
