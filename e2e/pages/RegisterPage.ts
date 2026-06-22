import type { Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get fullName() {
    return this.page.getByLabel("Full Name");
  }

  get emailInput() {
    return this.page.getByLabel("Email");
  }
  get passwordInput() {
    return this.page.getByLabel("Password");
  }

  get submitRegister() {
    return this.page.getByRole("button", { name: /Register/ });
  }

  get errorAlert() {
    return this.page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(name: string, email: string, password: string) {
    await this.fullName.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitRegister.click();
  }
}
