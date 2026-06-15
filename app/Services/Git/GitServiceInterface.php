<?php

namespace App\Services\Git;

interface GitServiceInterface
{
    public function getBranches(string $owner, string $repo): array;
    public function getCommits(string $owner, string $repo, string $branch, int $limit = 10): array;
    public function createPullRequest(string $owner, string $repo, string $title, string $body, string $head, string $base = 'main'): array;
    public function getRepositories(): array;
    public function verifyWebhookSignature(string $payload, string $signature, string $secret): bool;
}
