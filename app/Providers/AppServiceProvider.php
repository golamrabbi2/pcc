<?php

namespace App\Providers;

use App\Services\Git\GitServiceInterface;
use App\Services\Git\GitHubService;
use App\Services\Git\MockGitService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(GitServiceInterface::class, function () {
            if (config('app.env') === 'production' && config('services.github.token')) {
                $service = new GitHubService();
                $service->setToken(config('services.github.token'));
                return $service;
            }
            return new MockGitService();
        });
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
