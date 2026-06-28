import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Page", () => {
  test("Login successfully with admin role", async ({ page }) => {
    const loginPage = new LoginPage(page);
    //step1: open login page
    await loginPage.goto();
    await loginPage.loginAdmin();
    await expect(page).toHaveURL("/dashboard");
  });

  test("Login successfully with admin members", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginMembers();
    await expect(page).toHaveURL("/dashboard");
  });
  test("Login unsuccessfully with password incorrectly", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin@test.com", "admin");
    await expect(loginPage.errorAlert).toBeVisible();
  });
});
