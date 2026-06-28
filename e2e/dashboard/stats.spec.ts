import { expect, test } from "../fixtures/auth.fixture";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Dashboard Page", () => {
  // --- Admin ---
  test("admin - display username", async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    const userStr = await adminPage.evaluate(() =>
      localStorage.getItem("user"),
    );
    const user = JSON.parse(userStr ?? "{}");
    await expect(dashboard.userName).toContainText(user.name);
  });

  test("admin - display stats correctly", async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    const res = await adminPage.request.get("http://localhost:3001/tasks");
    const tasks = await res.json();
    const todoCount = tasks.filter((t) => t.status === "todo").length;
    const inProgressCount = tasks.filter(
      (t) => t.status === "in-progress",
    ).length;
    const doneCount = tasks.filter((t) => t.status === "done").length;
    await expect(dashboard.todo).toContainText("Todo");
    await expect(dashboard.todo).toContainText(String(todoCount));
    await expect(dashboard.inProgress).toContainText("In Progress");
    await expect(dashboard.inProgress).toContainText(String(inProgressCount));
    await expect(dashboard.todoDone).toContainText("Done");
    await expect(dashboard.todoDone).toContainText(String(doneCount));
  });

  test("admin - sees New Project button", async ({ adminPage }) => {
    await expect(
      adminPage.getByRole("link", { name: /new project/i }),
    ).toBeVisible();
  });

  test("admin - logout redirect to /login", async ({ adminPage }) => {
    const dashboard = new DashboardPage(adminPage);
    await dashboard.logout();
    await expect(adminPage).toHaveURL("/login");
  });

  // --- Member ---
  test("member - display username", async ({ memberPage }) => {
    const dashboard = new DashboardPage(memberPage);
    const userStr = await memberPage.evaluate(() =>
      localStorage.getItem("user"),
    );
    const user = JSON.parse(userStr ?? "{}");
    await expect(dashboard.userName).toContainText(user.name);
  });

  test("member - does NOT see New Project button", async ({ memberPage }) => {
    await expect(
      memberPage.getByRole("link", { name: /new project/i }),
    ).not.toBeVisible();
  });

  test("member - logout redirect to /login", async ({ memberPage }) => {
    const dashboard = new DashboardPage(memberPage);
    await dashboard.logout();
    await expect(memberPage).toHaveURL("/login");
  });
});
