import type { Page } from "@playwright/test";

//initial Page for browserContext
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // using class getter - not use CSS selector due class is stable that not break UX
  get emailInput() {
    return this.page.getByLabel("Email");
  }

  get passwordInput() {
    return this.page.getByLabel("Password");
  }

  get submitButton() {
    return this.page.getByRole("button", { name: /Login/ });
  }

  get errorAlert() {
    return this.page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  //login normal
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  //login with role admin
  async loginAdmin() {
    await this.login("admin@test.com", "admin123");
    await this.page.waitForURL("/dashboard");
  }
  //login with role members
  async loginMembers() {
    await this.login("member@test.com", "member123");
    await this.page.waitForURL("/dashboard");
  }
}
