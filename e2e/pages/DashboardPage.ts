import { Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  get userName() {
    return this.page.getByTestId("user-name");
  }

  get todo() {
    return this.page.getByTestId("stat-todo");
  }

  get inProgress() {
    return this.page.getByTestId("stat-in-progress");
  }
  get todoDone() {
    return this.page.getByTestId("stat-done");
  }
  get statLogOut() {
    return this.page.getByRole("button", { name: /Logout/i });
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async logout() {
    await this.statLogOut.click();
  }
}
