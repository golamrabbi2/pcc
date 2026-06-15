import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import WorkPackageSheet from '@/Components/WorkPackageSheet';

const statusColors = {
  todo: 'bg-secondary/10 text-secondary',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
};

function WbsNode({ node, projectId, assignableUsers, depth, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const children = node.children ?? [];

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    router.post(route('wbs.store', projectId), {
      name: name.trim(),
      parent_id: node.id,
    }, {
      onSuccess: () => {
        setName('');
        setAdding(false);
      },
    });
  }

  function handleQuickStatus(e) {
    e.stopPropagation();
    const next = { todo: 'in_progress', in_progress: 'done', done: 'blocked', blocked: 'todo' };
    router.patch(route('wbs.patch', node.id), { status: next[node.status] || 'todo' });
  }

  return (
    <div>
      <div
        className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        onClick={() => onSelect(node)}
      >
        {children.length > 0 ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <svg
              className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="truncate text-sm font-medium">{node.name}</span>
          {node.linked_branch && (
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {node.linked_branch}
            </span>
          )}
          {node.assignee && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {node.assignee.name}
            </span>
          )}
        </div>

        <Badge variant="outline" className={cn('text-xs shrink-0', statusColors[node.status])}>
          {node.status.replace('_', ' ')}
        </Badge>

        <button
          onClick={handleQuickStatus}
          className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
          title="Cycle status"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="flex items-center gap-2 px-3 py-1"
          style={{ paddingLeft: `${(depth + 1) * 1.5 + 0.75}rem` }}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Work package name" className="h-8 text-sm" autoFocus />
          <Button type="submit" size="xs" disabled={!name.trim()}>Add</Button>
          <Button type="button" variant="ghost" size="xs" onClick={() => setAdding(false)}>Cancel</Button>
        </form>
      )}

      {expanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <WbsNode key={child.id} node={child} projectId={projectId} assignableUsers={assignableUsers} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WbsTree({ project, tree, assignableUsers }) {
  const [addingRoot, setAddingRoot] = useState(false);
  const [rootName, setRootName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleAddRoot(e) {
    e.preventDefault();
    if (!rootName.trim()) return;
    router.post(route('wbs.store', project.id), { name: rootName.trim() }, {
      onSuccess: () => { setRootName(''); setAddingRoot(false); },
    });
  }

  function handleSelectNode(node) {
    setSelectedNode(node);
    setSheetOpen(true);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Work Breakdown Structure</h3>
        <Button variant="outline" size="xs" onClick={() => setAddingRoot(!addingRoot)}>
          <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Root Package
        </Button>
      </div>

      {addingRoot && (
        <form onSubmit={handleAddRoot} className="mb-3 flex items-center gap-2">
          <Input value={rootName} onChange={(e) => setRootName(e.target.value)} placeholder="Root work package name" className="h-8 text-sm" autoFocus />
          <Button type="submit" size="xs" disabled={!rootName.trim()}>Add</Button>
          <Button type="button" variant="ghost" size="xs" onClick={() => setAddingRoot(false)}>Cancel</Button>
        </form>
      )}

      {tree.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-sm text-muted-foreground">
          <svg className="mb-2 h-8 w-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <p>No work packages yet</p>
          <p className="text-xs">Click "Add Root Package" to build your WBS</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          {tree.map((node) => (
            <WbsNode key={node.id} node={node} projectId={project.id} assignableUsers={assignableUsers} depth={0} onSelect={handleSelectNode} />
          ))}
        </div>
      )}

      <WorkPackageSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setSelectedNode(null); }}
        node={selectedNode}
        assignableUsers={assignableUsers}
        projectId={project.id}
      />
    </div>
  );
}
