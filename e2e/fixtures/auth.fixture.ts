import { test as base, type Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

type AuthFixture = {
  adminPage: Page;
  memberPage: Page;
};

export const test = base.extend<AuthFixture>({
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAdmin();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
  memberPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginMembers();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from "@playwright/test";
