# SPEC.md — Project Command Center V1

## Product Goal

Build a single-page web application that unifies Work Breakdown Structure (WBS) management, Git activity tracking, and AI-driven project health monitoring. The tool must reduce project management overhead by providing real-time traceability between work packages and code, alerting PMs to risks before they become problems, and preserving project knowledge when team members leave.

V1 delivers the core loop: **WBS → Git → Health → Handover** — no more, no less.

## Target Users

| User | Pain Point | How PCC Helps |
|---|---|---|
| **Project Manager** | Manual status reports, context-switching between Jira and GitHub, no early risk detection | WBS tree with auto health indicators, at-risk alerts, auto-generated stakeholder brief |
| **Developer** | Updating tickets feels disconnected from actual work; onboarding to inherited code is painful | Branch-WBS linking, handover capsules for inherited work packages |
| **Tech Lead** | No visibility into whether code activity matches the plan | Health dashboard, stale branch detection, scope creep flags |

## Core Screens

### 1. Project Dashboard (`/projects/{id}`)
- WBS tree view (collapsible, color-coded by health)
- At-risk sidebar (red/amber items only)
- Commit timeline for selected WBS item
- Quick stats: total WBS items, linked branches, stale items
- Notification bell for alerts

### 2. Project Setup Wizard (`/projects/create`)
- Step 1: Project name + description
- Step 2: Build WBS (drag-drop tree, add/remove/reorder, set dates)
- Step 3: Connect GitHub repo (search by name, authenticate via OAuth)
- Step 4: Review and launch

### 3. WBS Editor (`/projects/{id}/wbs`)
- Full drag-and-drop tree editing (react-arborist)
- Inline edit: title, assignee, dates, status
- Branch linker: pick from GitHub branches or type branch name pattern
- Baseline snapshot button ("Save baseline as v1.0")

### 4. Health View (`/projects/{id}/health`)
- Same WBS tree but with health dots as primary indicator
- Filter by health status (show all / green / amber / red)
- Click any WBS item to see health reason (e.g. "No commits in 5 days, past deadline")
- "Refresh health" button (manual trigger)
- Health history mini-chart per item

### 5. Handover View (`/projects/{id}/handover`)
- List of generated handover capsules for the project
- Per WBS item: "Generate Handover" button
- Preview capsule content in a Sheet/modal
- Shows PR status (draft, open, merged)
- Link to generated PR on GitHub

### 6. Auth Screens (Breeze scaffolded)
- Login (email + password, or GitHub OAuth)
- Register
- Password reset
- Profile editing

## Minimum Entities (Database)

### `users`
- id, name, email, password, github_id, github_token (encrypted), avatar, timestamps

### `projects`
- id, owner_id (FK), name, description, github_repo, github_owner, github_webhook_secret (encrypted), baseline_snapshot (JSON), status, timestamps

### `work_packages`
- id, project_id (FK), parent_id (FK, self), wbs_code, title, description, assignee_id (FK), status (enum), planned_start, planned_end, estimated_hours, linked_branch, sort_order, timestamps, soft_deletes

### `health_logs`
- id, work_package_id (FK), status (enum: green/amber/red), reason, metrics (JSON), checked_at, timestamps

### `handover_capsules`
- id, work_package_id (FK), generated_by (FK), content (Markdown), pr_url, pr_branch, generated_at, timestamps

### `github_webhook_calls`
- id, event_type, action, payload (JSON), status (enum), timestamps

### `project_members`
- id, project_id (FK), user_id (FK), role (enum), timestamps — UK on (project_id, user_id)

### `decision_logs`
- id, project_id (FK), work_package_id (FK, nullable), title, content, source (enum), source_url, timestamps

## Acceptance Criteria

### Must Have (V1 Gate)

1. **WBS CRUD**: PM can create a project, build a WBS tree (up to 3 levels deep), edit any work package, and delete it. All changes persist to MySQL.
2. **GitHub Connection**: PM can connect a GitHub repo to a project using OAuth. Branches are fetched and displayed in the branch picker.
3. **Branch Linking**: PM can link a work package to a branch. The WBS tree shows the linked branch name and latest commit date.
4. **Health Indicators**: Each work package shows a health status (green/amber/red) based on commit activity vs. plan. The health status updates within 5 minutes of a push event via webhook.
5. **Stale Branch Alert**: A branch with no commits in 5+ days and past the planned end date shows as red. PM is notified.
6. **Handover Capsule**: Clicking "Generate Handover" on a work package creates a Markdown file and opens a Pull Request in the connected repo.
7. **Auth**: Users can register, log in (email or GitHub OAuth), and manage their profile.
8. **Dashboard**: PM sees all the above in one page — WBS tree, health indicators, at-risk items.

### Should Have (Stretch)

9. **Baseline Snapshots**: PM can take a baseline snapshot of the WBS. The snapshot is stored as JSON in the project record and in `.pcc/` in the repo.
10. **Webhook Auto-linking**: When a branch named `wbs-*` is created via push event, PCC auto-links it to the matching WBS item.
11. **Decision Logs**: PR descriptions are extracted as decision log entries linked to the relevant WBS item.
12. **Team Management**: PM can invite users to a project with roles (admin, PM, developer, viewer).

## Verification Plan

### Automated Tests (Pest PHP)

```
tests/
├── Feature/
│   ├── ProjectTest.php          # CRUD, baseline snapshots
│   ├── WbsTest.php              # Tree CRUD, recursive loading, sorting
│   ├── HealthTest.php           # Health engine with known scenarios
│   ├── HandoverTest.php         # Capsule generation, PR creation
│   ├── GitHubConnectionTest.php # OAuth flow, branch fetching
│   └── Auth/
│       ├── AuthenticationTest.php  # Breeze defaults
│       └── RegistrationTest.php
├── Unit/
│   ├── HealthEngineTest.php     # Pure logic test (deterministic)
│   ├── HandoverGeneratorTest.php # Markdown output format
│   └── GitServiceTest.php       # MockGitService contract compliance
└── Browser/                      # (Future) Dusk browser tests
```

### Manual QA Checklist

| Scenario | Steps | Expected |
|---|---|---|
| New user flow | Register → Create project → Build WBS → Connect repo | All steps succeed with clear UI feedback |
| Health detection | Create WBS with past end date, no commits → Check dashboard | Red health indicator appears within polling cycle |
| Health recovery | Push a commit to the linked branch → Wait for webhook | Health changes to green within 1 minute |
| Handover flow | Click Generate Handover on a WBS item | PR is created in the repo, link is shown in UI |
| Stale branch alert | Create WBS with end date = yesterday, link branch with no commits | Red indicator + notification in bell |
| Unauthenticated access | Visit `/projects` without login | Redirected to login page |
| Mobile layout (future) | Dashboard on 375px viewport | No horizontal scroll, tree is readable |
