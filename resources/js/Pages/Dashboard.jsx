import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
    return (
        <AppLayout
            header={
                <h1 className="text-lg font-semibold">Dashboard</h1>
            }
        >
            <Head title="Dashboard" />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Active Projects</p>
                        <p className="mt-1 text-2xl font-semibold">0</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Work Packages</p>
                        <p className="mt-1 text-2xl font-semibold">0</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Health Score</p>
                        <p className="mt-1 text-2xl font-semibold">—</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <svg className="mb-4 h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Create a project to get started</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
