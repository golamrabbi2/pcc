import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const healthDot = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const projectStatusColors = {
  planning: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  on_hold: 'bg-orange-100 text-orange-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function Dashboard({ stats, projects, atRiskItems }) {
  const hasProjects = projects.length > 0;

  return (
    <AppLayout header={<h1 className="text-lg font-semibold">Dashboard</h1>}>
      <Head title="Dashboard" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Projects</p>
            <p className="mt-1 text-2xl font-semibold">{stats.total_projects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="mt-1 text-2xl font-semibold">{stats.active_projects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Packages</p>
            <p className="mt-1 text-2xl font-semibold">{stats.total_packages}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">At Risk</p>
            <p className={cn('mt-1 text-2xl font-semibold', stats.red > 0 ? 'text-red-600' : '')}>
              {stats.red}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Healthy</p>
            <p className="mt-1 text-2xl font-semibold text-green-600">{stats.green}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Recent Projects</h2>
            <Button variant="outline" size="xs" asChild>
              <Link href={route('projects.index')}>View All</Link>
            </Button>
          </div>

          {!hasProjects ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <svg className="mb-4 h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <p className="mb-4 text-sm text-muted-foreground">No projects yet</p>
                <Button asChild>
                  <Link href={route('projects.create')}>Create your first project</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {projects.map((p) => (
                <Link key={p.id} href={route('projects.show', p.id)}>
                  <Card className="transition-shadow hover:shadow-sm">
                    <CardContent className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.owner_name} · {p.package_count} packages · {p.created_at}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn('text-xs shrink-0', projectStatusColors[p.status])}>
                        {p.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">At-Risk Items</h2>
          {atRiskItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                {hasProjects ? 'No at-risk items' : 'Create a project to start tracking health'}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {atRiskItems.map((item, i) => (
                <Link key={i} href={route('health.show', item.project_id)}>
                  <Card className="border-red-200 transition-shadow hover:shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', healthDot.red)} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.package_name}</p>
                          <p className="text-xs text-muted-foreground">{item.project_name}</p>
                          <p className="mt-1 text-xs text-red-600 line-clamp-2">{item.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
