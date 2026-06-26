# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects/crud.spec.ts >> Display UI Page Detail with role Admin >> Delete Project
- Location: e2e/projects/crud.spec.ts:85:3

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('button', { name: /Delete Project/i })

```

# Test source

```ts
  1  | import type { Page } from "@playwright/test";
  2  | 
  3  | export class PageDetail {
  4  |   readonly page: Page;
  5  |   constructor(page: Page) {
  6  |     this.page = page;
  7  |   }
  8  | 
  9  |   get dashBoardLink() {
  10 |     return this.page.getByRole("link", { name: /Dashboard/i });
  11 |   }
  12 |   get pageDetailTitle() {
  13 |     return this.page.getByTestId("project-title");
  14 |   }
  15 |   get pageDetailSubTitle() {
  16 |     return this.page.getByTestId("project-description");
  17 |   }
  18 |   get editButton() {
  19 |     return this.page.getByRole("button", { name: /Edit Project/i });
  20 |   }
  21 |   get deleteButton() {
  22 |     return this.page.getByRole("button", { name: /Delete Project/i });
  23 |   }
  24 |   get saveButton() {
  25 |     return this.page.getByRole("button", { name: /Save/i });
  26 |   }
  27 |   get cancelButton() {
  28 |     return this.page.getByRole("button", { name: /Cancel/i });
  29 |   }
  30 |   get newTaskBtn() {
  31 |     return this.page.getByRole("link", { name: /New Task/ });
  32 |   }
  33 |   get editInput() {
  34 |     return this.page.getByLabel("Edit project name");
  35 |   }
  36 |   get editSubInput() {
  37 |     return this.page.getByLabel("Edit project description");
  38 |   }
  39 |   get searchInput() {
  40 |     return this.page.getByLabel("Search tasks");
  41 |   }
  42 |   get statusFilter() {
  43 |     return this.page.getByLabel("Filter by status");
  44 |   }
  45 |   get noTaskMsg() {
  46 |     return this.page.getByTestId("no-tasks");
  47 |   }
  48 |   taskItem(id: string) {
  49 |     return this.page.getByTestId(`task-item-${id}`);
  50 |   }
  51 |   taskItemStatus(id: string) {
  52 |     return this.page.getByTestId(`task-status-${id}`);
  53 |   }
  54 | 
  55 |   async goto(id: string) {
  56 |     await this.page.goto(`/projects/${id}`);
  57 |   }
  58 |   async editClick() {
  59 |     await this.editButton.click();
  60 |   }
  61 |   async saveClick() {
  62 |     await this.saveButton.click();
  63 |   }
  64 |   async deleteClick() {
> 65 |     await this.deleteButton.click();
     |                             ^ Error: locator.click: Target page, context or browser has been closed
  66 |   }
  67 |   async deleteClickCancel() {
  68 |     this.page.once("dialog", (dialog) => dialog.dismiss());
  69 |     await this.deleteButton.click();
  70 |   }
  71 | }
  72 | 
```