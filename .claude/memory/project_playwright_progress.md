---
name: project-playwright-progress
description: "Current Playwright testing progress — phases done, files created, pending work"
metadata: 
  node_type: memory
  type: project
  originSessionId: 08720495-f052-4892-8cc9-77d1d8ac7a06
---

## Status: In progress — API mocking phase now active

## Completed

| Phase | Files | Notes |
|---|---|---|
| Auth | `e2e/auth/login.spec.ts`, `e2e/auth/register.spec.ts` | login success/fail, register success/fail |
| Fixtures | `e2e/fixtures/auth.fixture.ts` | adminPage, memberPage — pre-authenticated fixtures |
| Dashboard stats | `e2e/dashboard/stats.spec.ts` | username, stats, role UI, logout |
| Projects CRUD | `e2e/projects/crud.spec.ts` | admin create (2-step), validation, member blocked, view/edit/delete project |
| Tasks delete | `e2e/tasks/crud.spec.ts` | create task via API then delete via UI, assert not visible |
| Tasks filter/search | `e2e/tasks/filter.spec.ts` | search by title (dynamic match), filter by status, empty state |
| Task file upload | `e2e/tasks/upload.spec.ts` | create task with file attachment, assert attachment-{id} visible |
| Custom fixtures | `e2e/fixtures/data.fixture.ts` | `getTaskByProject(id)` fixture merged from auth.fixture via base.extend |
| App.tsx fix | `src/App.tsx` | Added AdminRoute — member now redirected from /projects/* |
| tsconfig fix | `tsconfig.node.json` | Added `"e2e"` to include array so Buffer type resolves in e2e files |

## Pages (POM) created
- `e2e/pages/LoginPage.ts` ✅
- `e2e/pages/RegisterPage.ts` ✅
- `e2e/pages/DashboardPage.ts` ✅
- `e2e/pages/ProjectPage.ts` ✅
- `e2e/pages/PageDetail.ts` ✅ (taskItem, taskItemStatus, deleteBtnTask, attachVisible, searchInput, statusFilter, noTaskMsg)
- `e2e/pages/NewTask.ts` ✅ (fillStep1, fillStep2 with optional file upload param)

## Pending

| Phase | File | Scope |
|---|---|---|
| API mocking | `e2e/dashboard/api-mock.spec.ts` | page.route() — mock /projects, /tasks; empty state; error state; loading state |

**Why:** Covering full CRUD + role-based access for admin/member using POM + fixture pattern. API mocking is the final major concept not yet covered.

**How to apply:** When continuing Playwright work, focus on completing `api-mock.spec.ts`. See [[project_api_mock_concepts]] for detailed steps and concepts.
