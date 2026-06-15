import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WbsTree from '@/Components/WbsTree';
import { cn } from '@/lib/utils';

const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    on_hold: 'bg-orange-100 text-orange-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
};

export default function Show({ project, tree, assignableUsers }) {
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
                    <Badge variant="outline" className={cn('text-xs', statusColors[project.status])}>
                        {project.status}
                    </Badge>
                    <div className="ml-4 flex gap-1">
                        <Button variant="ghost" size="xs" asChild>
                            <Link href={route('projects.show', project.id)}>WBS</Link>
                        </Button>
                        <Button variant="ghost" size="xs" asChild>
                            <Link href={route('health.show', project.id)}>Health</Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <WbsTree
                        project={project}
                        tree={tree}
                        assignableUsers={assignableUsers}
                    />
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Project Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">Owner</p>
                                <p className="font-medium">{project.owner?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Status</p>
                                <Badge variant="outline" className={cn('text-xs', statusColors[project.status])}>
                                    {project.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            {project.github_repo && (
                                <div>
                                    <p className="text-xs text-muted-foreground">GitHub</p>
                                    <p className="font-medium">{project.github_repo}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {project.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link href={route('projects.edit', project.id)}>Edit</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
