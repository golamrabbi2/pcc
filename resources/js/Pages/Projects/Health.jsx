import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const healthColors = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const healthLabels = {
  green: 'Healthy',
  amber: 'At Risk',
  red: 'Critical',
};

function HealthDot({ status }) {
  return (
    <span className={cn('inline-block h-2.5 w-2.5 rounded-full shrink-0', healthColors[status])} />
  );
}

function HealthNode({ node, depth, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const children = node.children ?? [];
  const health = node.health ?? { status: 'amber', reason: 'Not checked' };
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          'group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 transition-colors',
          isSelected ? 'bg-muted' : 'hover:bg-muted/50',
        )}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        onClick={() => onSelect(node)}
      >
        {children.length > 0 ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <svg className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}

        <HealthDot status={health.status} />

        <span className="flex-1 truncate text-sm font-medium">{node.name}</span>

        {node.linked_branch && (
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {node.linked_branch}
          </span>
        )}
      </div>

      {expanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <HealthNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function filterTree(tree, filter) {
  if (filter === 'all') return tree;
  return tree.reduce((acc, node) => {
    const children = filterTree(node.children ?? [], filter);
    const matches = filter === 'all' || (node.health?.status === filter);
    if (matches || children.length > 0) {
      acc.push({ ...node, children });
    }
    return acc;
  }, []);
}

export default function Health({ project, tree, summary }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredTree = filterTree(tree, filter);

  function handleRefresh() {
    setRefreshing(true);
    router.post(route('health.refresh', project.id), {}, {
      onFinish: () => setRefreshing(false),
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
          <span className="text-sm text-muted-foreground">Health</span>
        </div>
      }
    >
      <Head title={`${project.name} Health`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {['green', 'amber', 'red'].map((s) => (
          <button key={s} onClick={() => setFilter(s === filter ? 'all' : s)}>
            <Card className={cn('transition-shadow hover:shadow-md', filter === s && 'ring-2 ring-ring')}>
              <CardContent className="flex items-center gap-3 p-4">
                <HealthDot status={s} />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">{healthLabels[s]}</p>
                  <p className="text-xl font-semibold">{summary[s] ?? 0}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
        <Card>
          <CardContent className="flex items-center justify-center p-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <svg className={cn('mr-1 h-4 w-4', refreshing && 'animate-spin')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Checking...' : 'Refresh'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            {filteredTree.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-sm text-muted-foreground">
                <p>No work packages match this filter.</p>
              </div>
            ) : (
              filteredTree.map((node) => (
                <HealthNode key={node.id} node={node} depth={0} selectedId={selectedNode?.id} onSelect={setSelectedNode} />
              ))
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Health Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <HealthDot status={selectedNode.health?.status} />
                    <span className="font-medium">{selectedNode.name}</span>
                  </div>
                  <div>
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      selectedNode.health?.status === 'green' && 'bg-green-100 text-green-800',
                      selectedNode.health?.status === 'amber' && 'bg-amber-100 text-amber-800',
                      selectedNode.health?.status === 'red' && 'bg-red-100 text-red-800',
                    )}>
                      {healthLabels[selectedNode.health?.status] ?? 'Unknown'}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{selectedNode.health?.reason}</p>
                  {selectedNode.planned_end && (
                    <div>
                      <p className="text-xs text-muted-foreground">Planned End</p>
                      <p className="font-medium">{selectedNode.planned_end}</p>
                    </div>
                  )}
                  {selectedNode.linked_branch && (
                    <div>
                      <p className="text-xs text-muted-foreground">Linked Branch</p>
                      <p className="font-medium">{selectedNode.linked_branch}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Click a work package to see health details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
