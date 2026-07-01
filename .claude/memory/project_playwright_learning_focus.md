---
name: project-playwright-learning-focus
description: "User's Playwright learning focus areas — concepts to practice more"
metadata: 
  node_type: memory
  type: project
  originSessionId: 88c648f6-2622-4ee2-b5bd-ff256342460e
---

## Status: Active learning — practicing Playwright concepts via TaskFlow E2E suite

## Concept to practice more: Custom Fixtures

User explicitly asked (2026-06-30) to take note and practice more on the **Fixture** concept in Playwright — `base.extend()`, merging fixtures (e.g. `data.fixture.ts` extending `auth.fixture.ts`), and exposing parameterized helper functions through fixtures (e.g. `getTaskByProject(id)`).

**Why:** User is learning Playwright via hands-on TaskFlow E2E test writing, guided step-by-step rather than having code written for them (see [[feedback_guide_dont_write]]). Fixtures was a newer/harder concept for them compared to POM and selectors, which they picked up faster.

**How to apply:** When future fixture-related work comes up (e.g. writing `upload.spec.ts` or `api-mock.spec.ts`), proactively offer extra explanation/practice on fixture patterns: how `use()` works, fixture scoping (test vs worker), why merging fixtures via `base.extend(other.extend)` works, and parameterized fixtures (functions returned from a fixture).

## Playwright concepts already covered well
Core test/expect, selectors (getByRole/getByLabel/getByTestId/getByText, scoped locators), actions (fill/click/selectOption/goto/waitForURL/evaluate), POM pattern, basic API testing via `page.request`.

## Currently learning: `page.route()` API mocking (2026-07-01)

Active practice via `e2e/dashboard/api-mock.spec.ts`. Concepts being absorbed:
- route() timing (must precede the navigation that triggers fetch)
- fulfill() vs continue() vs abort()
- adminPage fixture trap (pre-loads dashboard, need explicit dashboardPage.goto() after route())
- Full browser nav vs client-side nav — why page.goto() triggers fresh useEffect fetch
- Multi-endpoint mocking, empty/error/loading state mocking (steps 2-5 still to do)

See [[project_api_mock_concepts]] for full detail.

## Not yet covered
`page.route()` with delay (loading state testing), screenshots/visual testing.
