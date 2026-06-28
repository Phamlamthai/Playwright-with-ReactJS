import { expect, test } from "../fixtures/auth.fixture";
import { NewTask } from "../pages/NewTask";

test.describe("Display UI Step 1 normal", () => {
  test("should display the new task form", async ({ adminPage }) => {
    const newTask = new NewTask(adminPage);
    await newTask.goto("1");
    await expect(newTask.taskTitle).toBeVisible();
    await expect(newTask.stepIndicator).toContainText("Step 1 of 2");
    await expect(newTask.description).toBeVisible();
    await expect(newTask.nextBtn).toBeVisible();
  });
  test("Display UI Step 2 normal and create new task successfully", async ({
    adminPage,
  }) => {
    const newTask = new NewTask(adminPage);
    await newTask.goto("1");
    await newTask.fillStep1(
      "Test create new task",
      "This is a test description",
    );
    await expect(newTask.newTask).toBeVisible();
    await expect(newTask.stepIndicator).toContainText("Step 2 of 2");
    await expect(newTask.backBtnStep2).toBeVisible();
    await expect(newTask.createTaskBtnStep2).toBeVisible();
    await newTask.fillStep2("todo", "medium", "2026-06-28");
    await expect(adminPage).toHaveURL("/projects/1");
    await expect(adminPage.getByText("Test create new task")).toBeVisible();
  });
  test("validation error when title is empty", async ({ adminPage }) => {
    const newTask = new NewTask(adminPage);
    await newTask.goto("1");
    await newTask.nextBtn.click();
    await expect(newTask.errorAlert).toBeVisible();
    await expect(newTask.errorAlert).toContainText("Title is required");
    await expect(newTask.stepIndicator).toContainText("Step 1 of 2");
  });

  test("Member cannot access here", async ({ memberPage }) => {
    const newTask = new NewTask(memberPage);
    await newTask.goto("1");
    await expect(memberPage).toHaveURL("/dashboard");
  });
});
