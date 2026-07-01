import { test } from "../fixtures/auth.fixture";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Dashboard API Mocking", () => {
  test("show mocked project list on dashboard", async ({ adminPage }) => {
    const dashboardPage = new DashboardPage(adminPage);
  });
});
