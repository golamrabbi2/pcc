# AGENTS.md — Project Command Center

## Install Commands

```bash
# Backend
composer install

# Frontend
npm install --legacy-peer-deps

# Database (MySQL must be running)
php artisan migrate

# Optional: seed mock data
php artisan db:seed --class=MockProjectSeeder
```

## Run Commands

```bash
# Development (all services via Laravel dev script)
npm run dev

# Or individually:
php artisan serve          # Laravel server (port 8000)
npm run dev                # Vite HMR (port 5173)
php artisan queue:listen   # Horizon queue worker
php artisan reverb:start   # WebSocket server

# Build for production
npm run build
```

## Important Folders

| Path | Purpose |
|---|---|
| `app/` | Laravel models, controllers, services, jobs |
| `app/Services/Git/` | Git service interface + implementations (GitHub/Mock) |
| `app/Services/HealthEngine.php` | WBS health scoring logic |
| `app/Services/HandoverGenerator.php` | Handover capsule Markdown generator |
| `database/migrations/` | MySQL schema migrations |
| `database/seeders/` | Seeders including MockProjectSeeder for dev |
| `resources/js/` | React frontend (Inertia pages + components) |
| `resources/js/Components/ui/` | shadcn/ui generated components |
| `resources/js/lib/` | Utility functions (cn, etc.) |
| `resources/css/` | Tailwind CSS entry point |
| `routes/` | Laravel web + API routes |
| `docs/` | Architecture and design documents |
| `.pcc/` | PCC project config stored in Git |
| `tests/` | Pest PHP tests |

## Stack Conventions

### Laravel
- Use **Form Requests** for validation (`php artisan make:request`)
- Use **Services** for business logic (not in controllers)
- Use **Jobs** for background work (GitHub polling, health checks)
- Use **Events** for real-time broadcasts (Reverb)
- Controllers return Inertia responses or JSON for API routes
- All API routes prefixed with `/api/`

### React / Inertia
- Pages go in `resources/js/Pages/` — one file per route
- Shared components in `resources/js/Components/`
- Use shadcn/ui components from `resources/js/Components/ui/`
- Import utility: `import { cn } from '@/lib/utils'`
- Use `@inertiajs/react` for page navigation and form submissions
- TypeScript is *not* used — write plain JSX (.jsx)

### Database
- MySQL 8 with utf8mb4_unicode_ci
- WBS tree uses adjacency list (`parent_id`) + recursive CTE
- Migration naming: `YYYY_MM_DD_HHMMSS_descriptive_name.php`

### Tailwind CSS v4
- CSS entry: `resources/css/app.css` with `@import "tailwindcss"`
- No `tailwind.config.js` (v4 handles it differently)
- Use `@apply` for reusable component styles if needed

## Env Variables Rules

- **Canonical source**: `.env.example` — keep this updated
- **Local overrides**: `.env` (gitignored), never committed
- **Local-only overrides**: `.env.local` (gitignored)
- **Production**: `.env.production` (gitignored)
- All new env vars must be documented in `.env.example` with a comment

### Required env vars

```
DB_CONNECTION=mysql
DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD

GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (for OAuth)
GITHUB_TOKEN (for API calls, optional in dev)

REVERB_APP_ID, REVERB_APP_KEY, REVERB_APP_SECRET (for WebSockets)
```

## Secret Handling Rules

1. **Never commit** `.env`, `.env.local`, `.env.production`, or any file containing real secrets
2. **Never commit** `storage/*.key` files
3. **Never commit** API tokens, passwords, or private keys
4. If a secret is accidentally committed, rotate it immediately
5. Use `php artisan encrypt` for storing user tokens (GitHub PATs) in DB
6. `.env.example` should contain placeholder values only
7. GitHub webhook secrets are stored encrypted in the database

## Verification Expectations

Before marking a feature complete, the agent must verify:

### Code quality
- Run `php artisan test` — all tests pass
- Run `npm run build` — no build errors
- Check no new files are untracked outside `.gitignore`

### Feature-specific
- **CRUD**: Create, read, update, delete all work via the UI
- **GitHub integration**: Test with MockGitService as fallback
- **Health engine**: Seed known scenarios, check correct green/amber/red
- **Handover capsule**: Generated file appears as PR in the repo
- **Real-time**: Dashboard updates without full page refresh

### Security
- Auth protected routes return 302 for guests
- API routes return 401 without valid Sanctum token
- Webhook signatures are verified before processing

### Accessibility
- shadcn/ui components are accessible by default — do not break aria attributes
- All forms have proper labels and error states
