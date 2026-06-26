import { expect, test } from "../fixtures/auth.fixture";
import { PageDetail } from "../pages/PageDetail";
import { ProjectPage } from "../pages/ProjectPage";

test.describe("Display UI Project Page with role Admin", () => {
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

test.describe("Display UI Page Detail with role Admin", () => {
  test("Navigate to page detail and display UI normal", async ({
    adminPage,
  }) => {
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await expect(pageDetail.pageDetailTitle).toBeVisible();
    await expect(pageDetail.pageDetailSubTitle).toBeVisible();
    await expect(pageDetail.dashBoardLink).toBeVisible();
    await expect(pageDetail.editButton).toBeVisible();
    await expect(pageDetail.deleteButton).toBeVisible();
    await expect(pageDetail.newTaskBtn).toBeVisible();
  });

  test("Edit Page detail", async ({ adminPage }) => {
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await pageDetail.editClick();
    await pageDetail.editInput.fill("Project Alpha Updated");
    await pageDetail.editSubInput.fill("First project for testing updated");
    await pageDetail.saveClick();
    await expect(pageDetail.pageDetailTitle).toContainText(
      "Project Alpha Updated",
    );
    await expect(pageDetail.pageDetailSubTitle).toContainText(
      "First project for testing updated",
    );
  });

  test("Cancel Edit Page detail", async ({ adminPage }) => {
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await pageDetail.editClick();
    await expect(pageDetail.saveButton).toBeVisible();
    await expect(pageDetail.cancelButton).toBeVisible();
    await pageDetail.cancelButton.click();
    await expect(pageDetail.saveButton).not.toBeVisible();
    await expect(pageDetail.editButton).toBeVisible();
  });

  test("Delete Project", async ({ adminPage }) => {
    const res = await adminPage.request.post("http://localhost:3001/projects", {
      data: {
        name: "Testing delete project",
        description: "AHB",
        ownerId: "3",
        createdAt: "2026-06-25",
      },
    });
    const data = await res.json();
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto(data.id);
    await pageDetail.deleteClick();
    await expect(adminPage).toHaveURL("/dashboard");
  });

  test("Member cannot access here ", async ({ memberPage }) => {
    const pageDetail = new PageDetail(memberPage);
    await pageDetail.goto("1");
    await expect(memberPage).not.toHaveURL("projects/1");
  });
});
