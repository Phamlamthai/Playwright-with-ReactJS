# Skill: Fix Bug

## When to use this skill
Apply when: a test fails unexpectedly, a UI behavior is wrong, a runtime error appears, or a feature regresses.

---

## Process (never skip steps)

### 1. Reproduce first
- Identify the **exact** failing condition: which input, which user role, which state
- If it's a Playwright test: read the full error message + screenshot in `test-results/`
- Do NOT write a fix before you can reproduce the bug reliably

### 2. Identify the root cause
Ask: **WHY** does this happen, not just WHAT is wrong.
Common root causes in this project:
- Missing `await` on async call → silent failure, test passes when it shouldn't
- Route guard logic inverted or missing → wrong role can access page
- `localStorage` read before login completes → null parse error
- `JSON.parse(null)` throws → always use `?? '{}'` or `?? 'null'` null coalescing
- Test data left in `db.json` from previous run → stale state causes count mismatch

### 3. Fix at the right level
| Symptom | Fix location |
|---|---|
| Test selector not found | Check `data-testid` / `aria-label` / `htmlFor` in source component |
| Wrong redirect | `src/App.tsx` route guard |
| Wrong API response | `src/services/api.ts` or `server/db.json` |
| Test assertion wrong | spec file, not the app code |
| Fixture doesn't log in | `e2e/fixtures/auth.fixture.ts` |

### 4. Fix scope: minimum change
- Change only what's needed to fix the bug
- Do NOT refactor surrounding code while fixing
- Do NOT add new features during a bug fix

### 5. Verify
- Re-run the failing test: `npx playwright test <file> --headed`
- Run the full spec file to check for regressions
- If you touched `App.tsx` routes: run `e2e/projects/crud.spec.ts` (role guard tests)

---

## Common bugs in this codebase

### Missing await on expect
```ts
// WRONG — passes even when element not visible
expect(page.getByRole('alert')).toBeVisible()

// CORRECT
await expect(page.getByRole('alert')).toBeVisible()
```

### JSON.parse crash
```ts
// WRONG
const user = JSON.parse(localStorage.getItem('user') as string)

// CORRECT
const userStr = localStorage.getItem('user')
const user = userStr ? JSON.parse(userStr) : null
```

### Infinite redirect loop
```ts
// WRONG — member gets redirected /dashboard → /dashboard → loop
if (!isAdmin) return <Navigate to="/dashboard" />

// CORRECT — use separate route guards
// PrivateRoute: checks login only
// AdminRoute: checks login + role
```

### Stale db.json data
Tests that create projects/tasks leave data. Reset before full suite:
```bash
node server/reset-db.js
```
