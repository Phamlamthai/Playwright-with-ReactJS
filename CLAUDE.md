# TaskFlow — Project Context for Claude

## Stack
- **Frontend**: React 18 + TypeScript + Vite + React Router v6
- **Backend**: JSON Server (`http://localhost:3001`) — `server/db.json`
- **E2E Testing**: Playwright + POM pattern
- **Styling**: Plain CSS (`src/styles/components.css`)

## Running the project
```bash
npm run dev        # React app on :5173
npm run server     # JSON Server on :3001
npx playwright test                  # run all e2e tests
npx playwright test e2e/auth/        # run specific folder
npx playwright test --ui             # interactive UI mode
npx playwright show-report           # view HTML report
```

## Data models (`src/types/index.ts`)
```
User    { id, name, email, password, role: 'admin'|'member' }
Project { id, name, description, ownerId, createdAt }
Task    { id, title, description, status, priority, projectId, assigneeId, dueDate, attachment }
  status:   'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
```

## API layer (`src/services/api.ts`)
```
POST /users            → register
GET  /users?email&password → login
GET/POST/PATCH/DELETE /projects
GET/POST/PATCH/DELETE /tasks?projectId=
```

## Routes (`src/App.tsx`)
```
/            → redirect /login
/login       → public
/register    → public
/dashboard   → PrivateRoute (any logged-in user)
/projects/new         → AdminRoute (admin only)
/projects/:id         → AdminRoute
/projects/:id/tasks/new → AdminRoute
```

## Route guards
- `PrivateRoute` — checks `localStorage.getItem('user')` → redirect `/login` if null
- `AdminRoute`   — checks user + `user.role === 'admin'` → redirect `/dashboard` if member

## Auth flow
1. Login/Register → API call → save `user` object to `localStorage`
2. Route guards read `localStorage.user` on each navigation
3. Logout → `localStorage.removeItem('user')` → redirect `/login`

## Test accounts (`server/db.json`)
| Role   | Email             | Password  |
|--------|-------------------|-----------|
| admin  | admin@test.com    | admin123  |
| member | member@test.com   | member123 |

## E2E structure
```
e2e/
  fixtures/
    auth.fixture.ts   ← adminPage, memberPage fixtures
    data.fixture.ts
  pages/              ← Page Object Models
    LoginPage.ts
    RegisterPage.ts
    DashboardPage.ts
    ProjectPage.ts
  auth/
    login.spec.ts
    register.spec.ts
  dashboard/
    stats.spec.ts
    api-mock.spec.ts
  projects/
    crud.spec.ts
  tasks/
    crud.spec.ts
    filter.spec.ts
    upload.spec.ts
    wizard.spec.ts
```

## Key test IDs (`data-testid`)
```
user-name              → logged-in username in dashboard header
stat-todo              → todo count card
stat-in-progress       → in-progress count card
stat-done              → done count card
step-indicator         → "Step X of 2" in multi-step forms
project-item-{id}      → project list item
project-title          → project detail h1
project-description    → project detail description
task-item-{id}         → task list item
task-status-{id}       → status badge on task
task-attachment-{id}   → attachment indicator
no-tasks               → empty state message
```

## Skills (load when relevant)
- Bug fixing    → `.claude/skills/fix-bug.md`
- Debugging     → `.claude/skills/debug.md`
- Refactoring   → `.claude/skills/refactor.md`
- Playwright    → `.claude/skills/playwright.md`
