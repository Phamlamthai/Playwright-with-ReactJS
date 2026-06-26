# TaskFlow — Full Project Overview

## Purpose
A task management web app. Admin creates projects and tasks, assigns members. Members view their dashboard and tasks.

---

## User roles & permissions

| Action | Admin | Member |
|---|---|---|
| View dashboard | ✅ | ✅ |
| See task stats (todo/in-progress/done) | ✅ | ✅ |
| See "New Project" button | ✅ | ❌ |
| Access /projects/new | ✅ | ❌ → redirect /dashboard |
| Access /projects/:id | ✅ | ❌ → redirect /dashboard |
| Create project | ✅ | ❌ |
| Edit/Delete project | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Delete task | ✅ | ❌ |
| View task list (project detail) | ✅ | ❌ (route blocked) |

---

## Page flows

### Login flow
```
/login
  → fill email + password
  → POST /users?email=&password=
  → if found: save to localStorage('user') → navigate /dashboard
  → if not found: show alert error
```

### Register flow
```
/register
  → fill name + email + password
  → GET /users?email= (check duplicate)
  → if exists: show alert
  → if new: POST /users with role='member' → save localStorage → /dashboard
```

### Dashboard flow
```
/dashboard (PrivateRoute)
  → read user from localStorage
  → GET /projects (all)
  → for each project: GET /tasks?projectId=
  → display: username, stat counts (todo/in-progress/done), project list
  → admin sees "+ New Project" link
  → member does NOT see "+ New Project"
  → Logout: remove localStorage → /login
```

### Create Project flow (admin only)
```
/projects/new (AdminRoute)
  Step 1:
    → fill "Project Name" (id=project-name)
    → submit → validate (name required) → go to step 2
    → error: show role=alert
  Step 2:
    → fill "Description" (id=project-description, textarea)
    → submit → POST /projects → navigate /dashboard
    → Back button → return to step 1
  Header: "← Back" link → /dashboard
  Step indicator: data-testid="step-indicator" → "Step 1 of 2" / "Step 2 of 2"
```

### Project Detail flow (admin only)
```
/projects/:id (AdminRoute)
  → GET /projects/:id + GET /tasks?projectId=:id
  → Show: project name (data-testid="project-title"), description, tasks
  → Admin actions: "Edit Project" → inline form, "Delete Project" → confirm → /dashboard
  → Edit form: aria-label="Edit project name", aria-label="Edit project description"
  → Task filter: aria-label="Search tasks", aria-label="Filter by status"
  → Task list: data-testid="task-item-{id}", task status badge, priority badge
  → Empty state: data-testid="no-tasks"
  → "+ New Task" link → /projects/:id/tasks/new
```

### Create Task flow (admin only)
```
/projects/:id/tasks/new (AdminRoute)
  Step 1:
    → fill "Task Title" (id=task-title)
    → fill "Description" (id=task-description, optional)
    → submit → validate (title required) → go to step 2
  Step 2:
    → select "Status" (id=task-status): todo/in-progress/done
    → select "Priority" (id=task-priority): low/medium/high
    → fill "Due Date" (id=task-due-date, type=date)
    → upload "Attachment" (id=task-attachment, optional, type=file)
    → submit → POST /tasks → navigate /projects/:id
  Header: "← Back to {project.name}" link
  Step indicator: data-testid="step-indicator"
```

---

## Data relationships
```
User (1) ──owns──> (many) Project
Project (1) ──has──> (many) Task
User (1) ──assigned──> (many) Task (via assigneeId)
```

---

## API endpoints (`http://localhost:3001`)
```
GET    /users?email=&password=    → login
POST   /users                     → register
GET    /projects                  → list all
GET    /projects/:id              → get one
POST   /projects                  → create
PATCH  /projects/:id              → update
DELETE /projects/:id              → delete
GET    /tasks?projectId=:id       → tasks for project
POST   /tasks                     → create task
PATCH  /tasks/:id                 → update task
DELETE /tasks/:id                 → delete task
```

---

## Key component → selector mapping
```
DashboardPage.tsx:
  data-testid="user-name"         → user.name display
  data-testid="stat-todo"         → todo count card
  data-testid="stat-in-progress"  → in-progress count card
  data-testid="stat-done"         → done count card
  role="link" name=/new project/i → "+ New Project" (admin only)
  role="button" name=/logout/i    → Logout button

NewProjectPage.tsx (in ProjectsPage.tsx):
  data-testid="step-indicator"    → "Step X of 2"
  id="project-name"               → Project Name input (label htmlFor matches)
  id="project-description"        → Description textarea
  role="button" name=/next/i      → Next → button
  role="button" name=/create project/i → Create Project button
  role="button" name=/back/i      → ← Back button (step2)
  role="link" name=/back/i        → ← Back link (to dashboard)
  role="alert"                    → validation error

ProjectDetailPage.tsx (in ProjectsPage.tsx):
  data-testid="project-title"         → project name h1
  data-testid="project-description"   → project description
  aria-label="Edit project name"      → edit name input
  aria-label="Edit project description" → edit description textarea
  aria-label="Search tasks"           → search input
  aria-label="Filter by status"       → status select
  data-testid="task-item-{id}"        → task list item
  data-testid="task-status-{id}"      → task status badge
  data-testid="task-attachment-{id}"  → attachment indicator
  data-testid="no-tasks"              → empty state
  role="button" name=/edit project/i  → Edit Project
  role="button" name=/delete project/i → Delete Project
  role="button" name=/delete/i        → Delete task (per task)
  role="button" name=/save/i          → Save edit
  role="button" name=/cancel/i        → Cancel edit

NewTaskPage.tsx:
  data-testid="step-indicator"    → "Step X of 2"
  id="task-title"                 → Task Title input
  id="task-description"           → Description textarea
  id="task-status"                → Status select
  id="task-priority"              → Priority select
  id="task-due-date"              → Due Date input
  id="task-attachment"            → Attachment file input
  role="button" name=/next/i      → Next →
  role="button" name=/create task/i → Create Task
  role="alert"                    → validation error
```
