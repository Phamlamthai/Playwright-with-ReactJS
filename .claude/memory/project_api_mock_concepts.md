---
name: project-api-mock-concepts
description: "Playwright API mocking concepts covered via api-mock.spec.ts — page.route(), fulfill/continue/abort, timing, fixture trap"
metadata: 
  node_type: memory
  type: project
  originSessionId: 88c648f6-2622-4ee2-b5bd-ff256342460e
---

## Status: In progress — actively learning via `e2e/dashboard/api-mock.spec.ts`

## Core concept: `page.route(pattern, handler)`

Playwright hooks into the browser at the **CDP (Chrome DevTools Protocol) level** — the lowest network interception point inside the browser process itself, before any request leaves the browser. This is different from JS-level mocking (jest.mock) which replaces functions in memory.

**The rule: `route()` MUST be registered BEFORE the navigation/action that triggers the request.** Playwright can only intercept requests that are dispatched *after* the handler is registered. Once a request has been sent, it cannot be recalled.

```ts
// CORRECT — route registered before goto triggers fetch
await page.route("**/projects", handler);
await page.goto("/dashboard");

// WRONG — request already sent by the time route() runs
await page.goto("/dashboard");
await page.route("**/projects", handler);  // too late, misses the request
```

## URL pattern matching

Uses glob syntax — `**` matches any prefix including protocol/host:
- `"**/projects"` → matches `http://localhost:3001/projects`
- `"**/tasks?projectId=*"` → matches any tasks query with any projectId
- `"**/tasks**"` → matches all tasks endpoints including query strings

## 3 handler responses — every handler MUST call exactly one

| Method | Effect | Use for |
|---|---|---|
| `route.fulfill({status, contentType, body})` | Returns fake response. Request **NEVER reaches real server**. App code (axios) thinks it got a real response. | Controlling test data, deterministic assertions |
| `route.continue()` | Passes request through to real server as normal. | Observing requests without mocking |
| `route.abort()` | Cancels request with a network error (no response at all). | Simulating network failure, API down |

If a handler doesn't call any of these, the request hangs forever (useful to test "loading" states).

## Critical trap: `adminPage` fixture pre-loads Dashboard

The `adminPage` fixture (`auth.fixture.ts`) calls `loginAdmin()` which ends with `waitForURL('/dashboard')`. By the time that resolves, React has already mounted `DashboardPage`, its `useEffect` has already dispatched `GET /projects` + `GET /tasks?projectId=X` to the real json-server.

**→ So in any test using `adminPage`, you need to:**
1. Set up `page.route()` handlers
2. Then call `dashboardPage.goto()` to force a **full browser navigation** (not React Router client-side nav) — this reloads the entire JS context, remounts all components, re-runs all `useEffect`s, generating fresh network requests that are now intercepted by the registered handlers.

**Why full navigation works:** `page.goto()` is a Playwright-triggered full browser navigation (like typing a new URL in address bar) — destroys and rebuilds the entire JS runtime. React Router's `navigate()` is client-side only — it doesn't reload the page or re-run effects that already ran.

## Concepts covered via practice (in order learned)

1. **Why route() before goto()** — request dispatch timing, "bẫy" with fixture pre-navigation (2026-07-01)
2. **What fulfill() actually does** — request never reaches server, Playwright intercepts at CDP level (2026-07-01)
3. **fulfill vs continue vs abort** — three handler modes and when to use each (2026-07-01)
4. **Full browser nav vs client-side nav** — goto() reloads JS context; React Router navigate() does not (2026-07-01)

## Practice steps still to do (in api-mock.spec.ts)

| Step | What to mock | Assert | Concept |
|---|---|---|---|
| 1 (current) | `GET /projects` → fake project array | project-item-{id} visible with mock name | Basic fulfill() |
| 2 | `GET /projects` + `GET /tasks?projectId=*` | stat-todo/in-progress/done counts exact | Multiple route handlers simultaneously |
| 3 | `GET /projects` → `[]` empty array | "No projects yet." text visible | Empty state via mock |
| 4 | `GET /projects` → status 500 or abort | App behavior when API fails (likely stuck on "Loading...") | Error state, expose missing error handling |
| 5 (advanced) | Delay response — handler does not call fulfill/continue until setTimeout | "Loading..." text visible before data arrives | Loading state, temporal assertions |

**Why:** Steps 3-4 test UI edge cases that are impossible or unreliable to reproduce with real data in db.json — this is the main value of network-level mocking over DB seeding.

## Related files
- `e2e/dashboard/api-mock.spec.ts` — test file (in progress)
- `e2e/pages/DashboardPage.ts` — POM used (getters: todo, inProgress, todoDone, userName)
- `src/pages/DashboardPage.tsx` — source: useEffect calls projectApi.getAll() then taskApi.getByProject() per project; has `loading` state that shows "Loading..." if Promise never resolves
- `e2e/fixtures/auth.fixture.ts` — adminPage fixture (pre-navigates to /dashboard, triggering real fetch)
