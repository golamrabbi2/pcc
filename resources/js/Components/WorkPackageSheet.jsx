import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
];

const statusColors = {
  todo: 'bg-secondary/10 text-secondary',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
};

export default function WorkPackageSheet({ open, onClose, node, assignableUsers, projectId, onGenerateHandover }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [assigneeId, setAssigneeId] = useState('');
  const [linkedBranch, setLinkedBranch] = useState('');
  const [plannedStart, setPlannedStart] = useState('');
  const [plannedEnd, setPlannedEnd] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (node) {
      setName(node.name ?? '');
      setDescription(node.description ?? '');
      setStatus(node.status ?? 'todo');
      setAssigneeId(node.assignee_id ? String(node.assignee_id) : '');
      setLinkedBranch(node.linked_branch ?? '');
      setPlannedStart(node.planned_start ?? '');
      setPlannedEnd(node.planned_end ?? '');
    }
  }, [node]);

  function handleSave() {
    setSaving(true);
    router.patch(route('wbs.patch', node.id), {
      name,
      description,
      status,
      assignee_id: assigneeId ? Number(assigneeId) : null,
      linked_branch: linkedBranch || null,
      planned_start: plannedStart || null,
      planned_end: plannedEnd || null,
    }, {
      onSuccess: () => {
        setSaving(false);
        onClose();
      },
      onError: () => setSaving(false),
    });
  }

  function handleDelete() {
    if (confirm('Delete this work package and all its children?')) {
      router.delete(route('wbs.destroy', node.id), {
        onSuccess: () => onClose(),
      });
    }
  }

  if (!node) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="truncate">{node.name}</span>
            <Badge variant="outline" className={cn('text-xs shrink-0', statusColors[node.status])}>
              {node.status.replace('_', ' ')}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Work package details — changes are saved immediately.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-6">
          <div className="space-y-2">
            <Label htmlFor="wp-name">Name</Label>
            <Input
              id="wp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wp-desc">Description</Label>
            <textarea
              id="wp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {assignableUsers?.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wp-branch">Linked Branch</Label>
            <Input
              id="wp-branch"
              value={linkedBranch}
              onChange={(e) => setLinkedBranch(e.target.value)}
              placeholder="feature/my-feature"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="wp-start">Start Date</Label>
              <input
                id="wp-start"
                type="date"
                value={plannedStart}
                onChange={(e) => setPlannedStart(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wp-end">End Date</Label>
              <input
                id="wp-end"
                type="date"
                value={plannedEnd}
                onChange={(e) => setPlannedEnd(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (onGenerateHandover) onGenerateHandover(node.id);
              onClose();
            }}
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Handover
          </Button>
        </div>

        <SheetFooter className="flex-row justify-between gap-2">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
