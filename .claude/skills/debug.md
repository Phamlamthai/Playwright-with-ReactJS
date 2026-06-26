# Skill: Debug & Read Errors

## When to use this skill
Apply when: reading a Playwright error output, a console error in the browser, a TypeScript compile error, or unexpected runtime behavior.

---

## Playwright error reading guide

### Error: "Locator not found / TimeoutError"
```
TimeoutError: page.getByLabel('Project Name') timed out after 30000ms
```
**Means**: element doesn't exist in DOM or not visible within timeout
**Debug steps**:
1. Run with `--ui` to see what's on screen at that moment
2. Inspect the component source — is the `htmlFor` attribute matching the `id`?
3. Is the page even loaded? Check `await page.goto()` was called
4. Is the element behind a loading state? Add `await page.waitForSelector`

---

### Error: "expect(received).toHaveURL(expected)"
```
Expected: "/dashboard"
Received: "/login"
```
**Means**: redirect didn't happen / auth failed
**Debug steps**:
1. Check login credentials match `server/db.json`
2. Check `auth.fixture.ts` — did `loginAdmin()` succeed?
3. Add `await page.screenshot()` right before assertion to see what's on screen

---

### Error: "SyntaxError: Unexpected token" from JSON.parse
**Means**: `localStorage.getItem()` returned `null`, then parsed as string `"null"`
**Fix**: always guard with `?? '{}'`
```ts
const user = JSON.parse(userStr ?? '{}')
```

---

### Error: TypeScript "Property does not exist"
**Means**: wrong type assumption — check `src/types/index.ts` for the actual shape

---

## Browser console errors to watch for

| Error | Cause |
|---|---|
| `Cannot read properties of null` | `localStorage.getItem` returned null, no guard |
| `404 /users?email=...` | JSON Server not running on :3001 |
| `Network Error` | JSON Server crashed or not started |
| `Maximum update depth exceeded` | Infinite setState loop in useEffect |

---

## Reading Playwright HTML report
```bash
npx playwright show-report
```
- Click on failing test → see screenshot, video, trace
- "Trace" tab → step-by-step DOM snapshots
- Red step = where it failed, scroll up to see the action that caused it

---

## Debugging workflow
```bash
# Run single test with headed browser (see what happens)
npx playwright test e2e/projects/crud.spec.ts --headed

# Run with UI mode (step through manually)
npx playwright test --ui

# Run with debug mode (pauses at page.pause())
npx playwright test --debug

# Add pause inside test to inspect
await page.pause()  # opens Playwright Inspector
```

---

## Reading db.json state
When tests behave unexpectedly due to stale data:
```bash
cat server/db.json | python3 -m json.tool  # pretty print current state
node server/reset-db.js                    # reset to clean seed
```

---

## TypeScript errors in e2e files
- `import { Page }` should be `import type { Page }` — type-only imports
- `eslint react-hooks/rules-of-hooks` on `use(page)` → add eslint-disable comment, Playwright's `use` is not a React Hook
