# Playwright Concepts — TaskFlow E2E

## Fixtures

`test.extend<T>()` — tạo fixture mới. Mỗi fixture là một dependency được inject tự động vào test khi khai báo trong parameter.

```ts
export const test = base.extend<{ adminPage: Page }>({
  adminPage: async ({ page }, use) => {
    // setup
    await use(page); // trả quyền điều khiển cho test
    // teardown (nếu cần) chạy sau khi test xong
  },
});
```

**Merge fixtures**: extend từ fixture khác (không phải từ `@playwright/test` base) để gộp cả 2 fixture pool lại:
```ts
// data.fixture.ts extends auth.fixture.ts
export const test = base.extend<DataFixture>({ ... }); // base = auth.fixture's test
```

**Parameterized fixture** — fixture trả về một hàm để test tự gọi với tham số:
```ts
getTaskByProject: async ({ request }, use) => {
  const fn = async (projectId: string): Promise<Task[]> => { ... };
  await use(fn); // use nhận hàm, test gọi: await getTaskByProject("1")
},
```

**Fixture scope**: mặc định `"test"` — chạy lại cho mỗi test. Scope `"worker"` — dùng chung trong cùng 1 worker process (ít dùng).

---

## page.route() — API Mocking

`page.route()` hook vào **CDP (Chrome DevTools Protocol)** — tầng network của browser trước khi request rời khỏi browser process. Không phải JS mock, không thay thế function trong memory.

### Rule: route() TRƯỚC navigation/action trigger fetch
```ts
// ĐÚNG
await page.route("**/projects", handler);
await page.goto("/dashboard"); // fetch mới → bị chặn

// SAI — request đã bay trước khi route() tồn tại
await page.goto("/dashboard");
await page.route("**/projects", handler); // quá muộn
```

### 3 handler responses — handler PHẢI gọi 1 trong 3
| Method | Ý nghĩa |
|---|---|
| `route.fulfill({status, contentType, body})` | Trả response giả. Request **không bao giờ chạm server thật**. |
| `route.continue()` | Cho request đi tiếp đến server thật. |
| `route.abort()` | Huỷ request — browser nhận network error. |

Nếu không gọi cái nào → request treo mãi (có thể dùng để test "Loading..." state).

### Bẫy với adminPage fixture
`auth.fixture.ts` → `loginAdmin()` → `waitForURL('/dashboard')` → lúc URL đổi, React đã mount `DashboardPage` và `useEffect` đã dispatch `GET /projects` tới server thật.

→ Khi test body bắt đầu, request `/projects` đã xảy ra rồi. Cần:
```ts
await adminPage.route("**/projects", handler); // đăng ký mock
await dashboardPage.goto(); // full browser nav → reload JS context → useEffect chạy lại → fetch mới → bị chặn
```

### Tại sao `dashboardPage.goto()` tạo request mới?
`page.goto(url)` = full browser navigation (như gõ URL mới vào address bar) → hủy toàn bộ JS context → React mount lại từ đầu → `useEffect` chạy lại → request mới.

Khác với `navigate('/dashboard')` của React Router = client-side nav, không reload, không re-run `useEffect` đã chạy.

### URL glob patterns
- `"**/projects"` → `http://localhost:3001/projects`
- `"**/tasks?projectId=*"` → tasks với bất kỳ projectId nào
- `"**/tasks**"` → tất cả tasks endpoints kể cả query string

---

## Selectors

| Locator | Dùng khi |
|---|---|
| `getByRole("button", { name: /text/i })` | Element có semantic role rõ ràng |
| `getByLabel("Label text")` | Input được gắn với label |
| `getByTestId("data-testid-value")` | Element có `data-testid` attribute |
| `getByText("text")` | Element chứa text cụ thể |
| `locator.getByRole(...)` | Scoped — tìm trong phạm vi locator cha |

---

## Actions hay dùng

```ts
.fill("text")           // input text
.click()                // click
.selectOption("value")  // <select> element — KHÔNG dùng fill()
.setInputFiles(file)    // file upload — nhận { name, mimeType, buffer: Buffer }
.waitForURL("/path")    // đợi URL thay đổi
```

---

## API testing trong test (không qua UI)

```ts
// Qua page.request (dùng browser context, có cookie/auth)
const res = await adminPage.request.post("http://localhost:3001/tasks", { data: {...} });
const data = await res.json();

// Qua request fixture (standalone, không cần page)
const res = await request.get(`http://localhost:3001/tasks?projectId=${id}`);
```

---

## POM pattern

```ts
export class PageDetail {
  constructor(readonly page: Page) {}

  // getter = locator, không phải value — lazy, gọi mỗi lần mới evaluate
  get searchInput() { return this.page.getByLabel("Search tasks"); }

  // method với param khi selector cần dynamic id
  taskItem(id: string) { return this.page.getByTestId(`task-item-${id}`); }

  // scoped locator — tìm button BÊN TRONG task item
  deleteBtnTask(id: string) {
    return this.taskItem(id).getByRole("button", { name: /Delete/i });
  }
}
```

---

## Concepts đã cover

- [x] POM pattern (LoginPage, DashboardPage, ProjectPage, PageDetail, NewTask)
- [x] Fixtures cơ bản — `auth.fixture.ts` (adminPage, memberPage)
- [x] Fixtures merge — `data.fixture.ts` extend từ `auth.fixture.ts`
- [x] Parameterized fixture — `getTaskByProject(id)`
- [x] Selectors (getByRole/Label/TestId/Text, scoped locators)
- [x] Actions (fill, click, selectOption, setInputFiles, waitForURL)
- [x] API testing qua `page.request` và `request` fixture
- [x] Dialog handling (auto-accept / `page.once("dialog", ...)`)
- [x] `page.route()` — timing, fulfill/continue/abort, adminPage fixture trap
- [ ] Multi-endpoint mocking (`/projects` + `/tasks?projectId=*` cùng lúc)
- [ ] Empty state mock (`projects: []`)
- [ ] Error state mock (status 500, abort)
- [ ] Loading state mock (delay response)
