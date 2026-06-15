<?php

namespace App\Services;

use App\Models\WorkPackage;
use Illuminate\Support\Carbon;

class HealthEngine
{
    public function evaluate(WorkPackage $package): array
    {
        $now = Carbon::now();
        $metrics = [];
        $reasons = [];

        $hasBranch = !is_null($package->linked_branch);
        $plannedEnd = $package->planned_end ? Carbon::parse($package->planned_end) : null;
        $plannedStart = $package->planned_start ? Carbon::parse($package->planned_start) : null;
        $isDone = $package->status === 'done';
        $isBlocked = $package->status === 'blocked';
        $isInProgress = $package->status === 'in_progress';

        $metrics['has_linked_branch'] = $hasBranch;
        $metrics['planned_end'] = $plannedEnd?->format('Y-m-d');
        $metrics['is_overdue'] = false;
        $metrics['is_approaching_deadline'] = false;

        // Rule 1: Blocked → Red
        if ($isBlocked) {
            $status = 'red';
            $reasons[] = 'Work package is blocked.';
        }

        // Rule 2: Done → Green
        elseif ($isDone) {
            $status = 'green';
            $reasons[] = 'Work package is completed.';
        }

        // Rule 3: Past planned end and not done → Red
        elseif ($plannedEnd && $plannedEnd->isPast()) {
            $status = 'red';
            $metrics['is_overdue'] = true;
            $reasons[] = 'Past planned end date (' . $plannedEnd->format('M j') . ') and not completed.';
            if (!$hasBranch) {
                $reasons[] = 'No branch linked to this work package.';
            }
        }

        // Rule 4: Planned end within 3 days → Amber
        elseif ($plannedEnd && $plannedEnd->diffInDays($now, false) <= 3 && $plannedEnd->isFuture()) {
            $status = 'amber';
            $metrics['is_approaching_deadline'] = true;
            $reasons[] = 'Deadline approaching — ' . $plannedEnd->diffInDays($now) . ' days remaining.';
            if (!$hasBranch) {
                $reasons[] = 'No branch linked.';
            }
        }

        // Rule 5: No linked branch but has dates → Amber
        elseif (!$hasBranch && ($plannedStart || $plannedEnd)) {
            $status = 'amber';
            $reasons[] = 'No branch linked to this work package.';
        }

        // Rule 6: No dates set → Amber
        elseif (!$plannedStart && !$plannedEnd) {
            $status = 'amber';
            $reasons[] = 'No planned dates set.';
        }

        // Rule 7: In progress with linked branch → Green
        elseif ($isInProgress && $hasBranch) {
            $status = 'green';
            $reasons[] = 'In progress with linked branch.';
        }

        // Rule 8: Default → Amber
        else {
            $status = 'amber';
            $reasons[] = 'No health issues detected but incomplete configuration.';
        }

        return [
            'status' => $status,
            'reason' => implode(' ', $reasons),
            'metrics' => $metrics,
            'checked_at' => $now->toDateTimeString(),
        ];
    }
}
