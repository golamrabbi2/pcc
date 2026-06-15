import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const prStatusColors = {
  draft: 'bg-gray-100 text-gray-800',
  open: 'bg-green-100 text-green-800',
  merged: 'bg-purple-100 text-purple-800',
};

export default function Handover({ project, capsules, tree }) {
  const [generating, setGenerating] = useState(null);

  function handleGenerate(pkgId) {
    setGenerating(pkgId);
    router.post(route('handover.generate', pkgId), {}, {
      onFinish: () => setGenerating(null),
    });
  }

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
          <span className="text-sm text-muted-foreground">Handovers</span>
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
          </div>
        </div>
      }
    >
      <Head title={`${project.name} Handovers`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {capsules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <svg className="mb-4 h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mb-1 text-sm font-medium">No handover capsules yet</p>
                <p className="mb-4 text-xs text-muted-foreground">Select a work package and click "Generate Handover"</p>
              </CardContent>
            </Card>
          ) : (
            capsules.map((capsule) => (
              <Card key={capsule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm">{capsule.work_package?.name}</CardTitle>
                      <CardDescription>
                        Generated {new Date(capsule.generated_at).toLocaleDateString()} by {capsule.generator?.name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={cn('text-xs', prStatusColors[capsule.pr_status])}>
                      {capsule.pr_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-48 overflow-auto rounded bg-muted p-3 text-xs text-muted-foreground">
                    {capsule.content}
                  </pre>
                  {capsule.pr_url && (
                    <a
                      href={capsule.pr_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View PR
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Work Packages</CardTitle>
              <CardDescription>Click to generate a handover capsule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {renderPackageTree(tree, generating, handleGenerate)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function renderPackageTree(tree, generating, handleGenerate, depth = 0) {
  return tree.map((node) => (
    <div key={node.id}>
      <div
        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
      >
        <span className="flex-1 truncate">{node.name}</span>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => handleGenerate(node.id)}
          disabled={generating === node.id}
        >
          {generating === node.id ? (
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </Button>
      </div>
      {node.children?.length > 0 && renderPackageTree(node.children, generating, handleGenerate, depth + 1)}
    </div>
  ));
}
