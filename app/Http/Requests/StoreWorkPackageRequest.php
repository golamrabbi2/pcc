<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'parent_id' => ['nullable', 'exists:work_packages,id'],
            'status' => ['nullable', 'in:todo,in_progress,done,blocked'],
            'assignee_id' => ['nullable', 'exists:users,id'],
            'linked_branch' => ['nullable', 'string', 'max:255'],
            'planned_start' => ['nullable', 'date'],
            'planned_end' => ['nullable', 'date'],
        ];
    }
}
