# Skill: Refactor

## When to use this skill
Apply when: duplicate code appears in 3+ places, a POM getter is mis-named, selector logic is spread across spec files, or a test helper is repeated across specs.

---

## Principles
1. **No behavior change** — refactoring must not change what tests assert or what app does
2. **One type of change per PR** — don't mix refactor + feature + bug fix
3. **Rename for clarity, not style** — only rename if the current name is actively misleading
4. **Extract when truly reused** — 2 similar things is a coincidence, 3 is a pattern

---

## POM refactor checklist

### Naming conventions
| Category | Pattern | Example |
|---|---|---|
| Input getter | `*Input` | `projectNameInput`, `emailInput` |
| Button getter | `*Btn` | `nextBtn`, `createBtn`, `backBtn` |
| Link getter | `*Link` | `backLink`, `dashboardLink` |
| Display element | descriptive | `stepIndicator`, `errorAlert`, `userName` |
| Action method | verb + noun | `fillStep1`, `createProject`, `deleteTask` |

### Known renames needed in this project
- `ProjectPage.descriptionTitle` → `descriptionInput` (it's an input, not a title)
- `ProjectPage.createProject` getter → `createBtn` (avoid naming getter same as action method)
- `ProjectPage.backBtn` conflicts with `backLink` (one is `<button>`, one is `<Link>`)

---

## Spec file refactor checklist
- If setup is repeated in `beforeEach` → move to fixture
- If a selector appears in 3+ tests → move to POM getter
- If a sequence of actions repeats → extract to POM method
- If test data is hardcoded in multiple places → extract to `e2e/fixtures/data.fixture.ts`

---

## Refactor process
1. Read all affected files before touching anything
2. Make the change in one file at a time
3. After each file: verify no TypeScript errors (`npx tsc --noEmit`)
4. Run the affected test suite after all changes
5. Commit refactor separately from feature work

---

## What NOT to refactor
- Don't extract abstractions that only exist once
- Don't add generic base classes to POMs (each page is different enough)
- Don't unify `adminPage` and `memberPage` — they intentionally test different permissions
- Don't add comments explaining WHAT the code does (only WHY if non-obvious)
