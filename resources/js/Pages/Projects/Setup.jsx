import { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Setup({ project, auth }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const user = auth?.user;
  const hasGitHub = !!user?.github_id;

  useEffect(() => {
    if (hasGitHub) {
      setLoading(true);
      fetch(route('git.repos'))
        .then((r) => r.json())
        .then((data) => setRepos(data))
        .finally(() => setLoading(false));
    }
  }, [hasGitHub]);

  function handleConnect(fullName) {
    const [owner, repo] = fullName.split('/');
    router.post(route('projects.connect-repo', project.id), {
      github_repo: repo,
      github_owner: owner,
    }, {
      preserveScroll: true,
    });
  }

  const filteredRepos = repos.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout
      header={
        <div className="flex items-center gap-3">
          <Link href={route('projects.index')} className="text-muted-foreground hover:text-foreground">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">{project.name}</h1>
          <span className="text-sm text-muted-foreground">Setup</span>
          <div className="ml-4 flex gap-1">
            <Button variant="ghost" size="xs" asChild>
              <Link href={route('projects.show', project.id)}>WBS</Link>
            </Button>
            <Button variant="ghost" size="xs" asChild>
              <Link href={route('health.show', project.id)}>Health</Link>
            </Button>
            <Button variant="ghost" size="xs" asChild>
              <Link href={route('handover.index', project.id)}>Handovers</Link>
            </Button>
            <Button variant="ghost" size="xs" asChild>
              <Link href={route('projects.edit', project.id)}>Settings</Link>
            </Button>
          </div>
        </div>
      }
    >
      <Head title={`${project.name} Setup`} />

      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">GitHub Connection</CardTitle>
            <CardDescription>
              {hasGitHub
                ? 'Pick a repository to link this project to.'
                : 'Connect your GitHub account to link repositories.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasGitHub ? (
              <Button asChild>
                <a href={route('github.redirect')}>
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Connect GitHub
                </a>
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Search repositories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {loading ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">Loading repositories...</p>
                  ) : filteredRepos.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">No repositories found.</p>
                  ) : (
                    filteredRepos.map((repo) => (
                      <div
                        key={repo.full_name}
                        className={cn(
                          'flex items-center justify-between rounded-lg border p-3 transition-colors',
                          project.github_repo === repo.name
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50',
                        )}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{repo.full_name}</p>
                        </div>
                        {project.github_repo === repo.name ? (
                          <Badge variant="outline" className="text-xs shrink-0">Connected</Badge>
                        ) : (
                          <Button size="xs" variant="outline" onClick={() => handleConnect(repo.full_name)}>
                            Connect
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repository</span>
              <span className="font-medium">{project.github_repo || 'Not connected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium">{project.github_owner || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GitHub Account</span>
              <span className="font-medium">{hasGitHub ? 'Connected' : 'Not connected'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
