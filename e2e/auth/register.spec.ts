import test, { expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";

test.describe("Register Page", () => {
  test("Register successfully", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(
      "Test User",
      `test_${Date.now()}@test.com`,
      "test12345",
    );
    await expect(page).toHaveURL("/dashboard");
  });

  test("Register failed", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register("Test User", "New_user@test.com", "test");
    await expect(registerPage.errorAlert).toBeVisible();
  });
});
