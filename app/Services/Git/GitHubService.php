<?php

namespace App\Services\Git;

use Github\AuthMethod;
use Github\Client;
use Illuminate\Support\Facades\Log;

class GitHubService implements GitServiceInterface
{
    public function __construct(
        protected ?Client $client = null,
    ) {}

    public function setToken(string $token): void
    {
        $this->client = Client::createWithHttpClient(new \GuzzleHttp\Client());
        $this->client->authenticate($token, authMethod: AuthMethod::ACCESS_TOKEN);
    }

    public function getBranches(string $owner, string $repo): array
    {
        if (!$this->client) return [];
        try {
            $branches = $this->client->api('repo')->branches($owner, $repo);
            return array_map(fn($b) => ['name' => $b['name'], 'sha' => $b['commit']['sha']], $branches);
        } catch (\Exception $e) {
            Log::warning('GitHub: failed to fetch branches', ['error' => $e->getMessage()]);
            return [];
        }
    }

    public function getCommits(string $owner, string $repo, string $branch, int $limit = 10): array
    {
        if (!$this->client) return [];
        try {
            $commits = $this->client->api('repo')->commits()->all($owner, $repo, ['sha' => $branch, 'per_page' => $limit]);
            return array_map(fn($c) => [
                'sha' => $c['sha'],
                'message' => $c['commit']['message'],
                'author' => $c['commit']['author']['name'] ?? 'unknown',
                'date' => $c['commit']['author']['date'] ?? null,
            ], $commits);
        } catch (\Exception $e) {
            Log::warning('GitHub: failed to fetch commits', ['error' => $e->getMessage()]);
            return [];
        }
    }

    public function createPullRequest(string $owner, string $repo, string $title, string $body, string $head, string $base = 'main'): array
    {
        if (!$this->client) return [];
        try {
            $pr = $this->client->api('pr')->create($owner, $repo, ['title' => $title, 'body' => $body, 'head' => $head, 'base' => $base]);
            return ['url' => $pr['html_url'], 'number' => $pr['number'], 'state' => $pr['state']];
        } catch (\Exception $e) {
            Log::warning('GitHub: failed to create PR', ['error' => $e->getMessage()]);
            return [];
        }
    }

    public function getRepositories(): array
    {
        if (!$this->client) return [];
        try {
            $repos = $this->client->api('me')->repositories();
            return array_map(fn($r) => ['full_name' => $r['full_name'], 'name' => $r['name'], 'owner' => $r['owner']['login']], $repos);
        } catch (\Exception $e) {
            Log::warning('GitHub: failed to fetch repos', ['error' => $e->getMessage()]);
            return [];
        }
    }

    public function verifyWebhookSignature(string $payload, string $signature, string $secret): bool
    {
        $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
        return hash_equals($expected, $signature);
    }
}
