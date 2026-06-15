import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    on_hold: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export default function Index({ projects }) {
    return (
        <AppLayout header={<h1 className="text-lg font-semibold">Projects</h1>}>
            <Head title="Projects" />

            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {projects.length} project{projects.length !== 1 ? 's' : ''}
                </p>
                <Button asChild>
                    <Link href={route('projects.create')}>New Project</Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <svg className="mb-4 h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <p className="mb-4 text-sm text-muted-foreground">No projects yet</p>
                        <Button asChild>
                            <Link href={route('projects.create')}>Create your first project</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Link key={project.id} href={route('projects.show', project.id)}>
                            <Card className="h-full transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base">{project.name}</CardTitle>
                                        <Badge variant="outline" className="shrink-0 text-xs">
                                            {project.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {project.description ? (
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {project.description}
                                        </p>
                                    ) : (
                                        <p className="text-sm italic text-muted-foreground/60">No description</p>
                                    )}
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Created by {project.owner?.name ?? 'Unknown'}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
