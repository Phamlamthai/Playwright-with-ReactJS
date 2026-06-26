# Skill: Playwright Testing

## When to use this skill
Automatically apply when: writing new specs, adding page objects, debugging test failures, reviewing test coverage.

---

## Core principles (15yr perspective)
1. **Test behavior, not implementation** — assert what the user sees, never assert internal state like React state or component names
2. **Selectors priority**: `getByRole` > `getByLabel` > `getByTestId` > `getByText` > CSS selector (last resort)
3. **Never hardcode test data** that could change — read from `localStorage`, API response, or seed from fixture
4. **Each test must be independent** — no shared mutable state between tests, no order dependency
5. **Fixture over beforeEach** — auth setup belongs in `auth.fixture.ts`, not repeated per spec

---

## POM rules
```ts
// getters = Locators only (no await, no interaction)
get submitBtn() { return this.page.getByRole('button', { name: /submit/i }) }

// methods = async actions
async fillForm(data: { name: string }) {
  await this.nameInput.fill(data.name)
  await this.submitBtn.click()
}
```

- Getter naming: describe the element (`projectNameInput`, `errorAlert`, `stepIndicator`)
- Method naming: describe the action (`createProject`, `fillStep1`, `deleteTask`)
- Never put assertions inside POM — assertions belong in the spec

---

## Fixture pattern
```ts
// auth.fixture.ts — extend base, inject pre-authenticated page
export const test = base.extend<AuthFixture>({
  adminPage: async ({ page }, use) => {
    // setup: login
    await new LoginPage(page).loginAdmin()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)   // ← barrier: test runs here
    // teardown: (optional cleanup after use)
  }
})
export { expect } from '@playwright/test'
```

---

## Reading dynamic data
```ts
// Read localStorage after login (never hardcode username)
const userStr = await page.evaluate(() => localStorage.getItem('user'))
const user = JSON.parse(userStr ?? '{}')
await expect(dashboard.userName).toContainText(user.name)
```

---

## Common assertion patterns
```ts
await expect(page).toHaveURL('/dashboard')
await expect(element).toBeVisible()
await expect(element).not.toBeVisible()
await expect(element).toContainText('some text')
await expect(input).toHaveValue('filled value')
await expect(element).toHaveCount(3)
```

---

## Test structure template
```ts
test.describe('Feature — Role/Context', () => {
  test('action → expected result', async ({ adminPage }) => {
    const page = new SomePage(adminPage)
    await page.goto()
    // arrange
    // act
    // assert
  })
})
```

---

## DB reset between runs
When tests create data (projects, tasks), the `server/db.json` accumulates entries.
Run `node server/reset-db.js` before a full suite run to reset to clean state.

---

## Debug checklist when test fails
1. Run with `--ui` flag → step through each action visually
2. Check `test-results/` folder → screenshot + video on failure
3. Check `await` is present on ALL `expect()` calls
4. Verify selector with `page.pause()` or Playwright Inspector
5. Check if data-testid exists in the actual DOM (`getByTestId` fails silently if missing)
6. Run `npx playwright show-report` → read the full error trace

---

## Coverage checklist (TaskFlow)
- [ ] Auth: login success/fail, register success/fail, logout
- [ ] Dashboard: username display, stat counts, role-based UI, logout redirect
- [ ] Projects: create (admin), member blocked, edit, delete
- [ ] Project Detail: task list, search filter, status filter
- [ ] Tasks: create wizard (step1+2), validation error, delete
- [ ] Tasks: attachment upload
