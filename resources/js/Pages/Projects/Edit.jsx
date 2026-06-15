import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Edit({ project }) {
    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        description: project.description ?? '',
        status: project.status,
        github_repo: project.github_repo ?? '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('projects.update', project.id));
    }

    return (
        <AppLayout header={<h1 className="text-lg font-semibold">Edit Project</h1>}>
            <Head title={`Edit ${project.name}`} />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val) => setData('status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="planning">Planning</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-destructive">{errors.status}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="github_repo">GitHub Repository</Label>
                                <Input
                                    id="github_repo"
                                    value={data.github_repo}
                                    onChange={(e) => setData('github_repo', e.target.value)}
                                    placeholder="owner/repo"
                                />
                                {errors.github_repo && (
                                    <p className="text-sm text-destructive">{errors.github_repo}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href={route('projects.show', project.id)}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
