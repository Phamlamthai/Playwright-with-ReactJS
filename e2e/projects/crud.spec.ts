import { expect, test } from "../fixtures/auth.fixture";
import { ProjectPage } from "../pages/ProjectPage";

test.describe("Display UI with role Admin", () => {
  test("Navigate to new project and show elements that visibility", async ({
    adminPage,
  }) => {
    const projectPage = new ProjectPage(adminPage);
    await projectPage.goto();
    await expect(projectPage.projectTitle).toBeVisible();
    await expect(projectPage.projectName).toBeVisible();
    await expect(projectPage.stepIndicator).toContainText("Step 1 of 2");
    await expect(projectPage.nextBtn).toBeVisible();
  });

  test("Admin - Filled Step 1 and go to step 2 then create project new", async ({
    adminPage,
  }) => {
    const projectPage = new ProjectPage(adminPage);
    await projectPage.goto();
    await projectPage.fillStep1("ReactJS");
    await expect(projectPage.stepIndicator).toContainText("Step 2 of 2");
    await expect(projectPage.descriptionTitle).toBeVisible();
    await expect(projectPage.createProject).toBeVisible();

    await projectPage.fillStep2("Learning it now");
    await expect(adminPage).toHaveURL("/dashboard");
  });

  test("Fill step 1 error", async ({ adminPage }) => {
    const projectPage = new ProjectPage(adminPage);
    await projectPage.goto();
    await projectPage.nextBtn.click();
    await expect(projectPage.errorAlert).toBeVisible();
  });

  test("Member cannot access", async ({ memberPage }) => {
    const projectPage = new ProjectPage(memberPage);
    await projectPage.goto();
    await expect(memberPage).not.toHaveURL("/projects/new");
  });
});
