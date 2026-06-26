import type { Page } from "@playwright/test";

export class PageDetail {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  get dashBoardLink() {
    return this.page.getByRole("link", { name: /Dashboard/i });
  }
  get pageDetailTitle() {
    return this.page.getByTestId("project-title");
  }
  get pageDetailSubTitle() {
    return this.page.getByTestId("project-description");
  }
  get editButton() {
    return this.page.getByRole("button", { name: /Edit Project/i });
  }
  get deleteButton() {
    return this.page.getByRole("button", { name: /Delete Project/i });
  }
  get saveButton() {
    return this.page.getByRole("button", { name: /Save/i });
  }
  get cancelButton() {
    return this.page.getByRole("button", { name: /Cancel/i });
  }
  get newTaskBtn() {
    return this.page.getByRole("link", { name: /New Task/ });
  }
  get editInput() {
    return this.page.getByLabel("Edit project name");
  }
  get editSubInput() {
    return this.page.getByLabel("Edit project description");
  }
  get searchInput() {
    return this.page.getByLabel("Search tasks");
  }
  get statusFilter() {
    return this.page.getByLabel("Filter by status");
  }
  get noTaskMsg() {
    return this.page.getByTestId("no-tasks");
  }
  taskItem(id: string) {
    return this.page.getByTestId(`task-item-${id}`);
  }
  taskItemStatus(id: string) {
    return this.page.getByTestId(`task-status-${id}`);
  }

  async goto(id: string) {
    await this.page.goto(`/projects/${id}`);
  }
  async editClick() {
    await this.editButton.click();
  }
  async saveClick() {
    await this.saveButton.click();
  }
  async deleteClick() {
    await this.deleteButton.click();
  }
  async deleteClickCancel() {
    this.page.once("dialog", (dialog) => dialog.dismiss());
    await this.deleteButton.click();
  }
}
