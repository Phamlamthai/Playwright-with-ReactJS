import { expect, test } from "../fixtures/data.fixture";
import { PageDetail } from "../pages/PageDetail";

test.describe("Display UI filter search input normal", () => {
  test("Search input successfully", async ({ adminPage, getTaskByProject }) => {
    const keyword = "Setup";
    const tasks = await getTaskByProject("1");
    const filterTask = tasks.filter((t) =>
      t.title.toLowerCase().includes(keyword.toLowerCase()),
    );
    const otherTasks = tasks.filter(
      (t) => !t.title.toLowerCase().includes(keyword.toLowerCase()),
    );
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await pageDetail.searchInput.fill(keyword);
    for (const t of filterTask) {
      await expect(pageDetail.taskItem(t.id)).toBeVisible();
    }
    for (const t of otherTasks) {
      await expect(pageDetail.taskItem(t.id)).not.toBeVisible();
    }
  });
  test("Search Input by status ", async ({ adminPage, getTaskByProject }) => {
    const tasks = await getTaskByProject("1");
    const status = "done";
    const matchStatus = tasks.filter((t) => t.status === status);
    const otherStatus = tasks.filter((t) => t.status !== status);
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await pageDetail.statusFilter.selectOption("done");
    for (const st of matchStatus) {
      await expect(pageDetail.taskItem(st.id)).toBeVisible();
    }
    for (const st of otherStatus) {
      await expect(pageDetail.taskItem(st.id)).not.toBeVisible();
    }
  });

  test("Search Input not found", async ({ adminPage }) => {
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await pageDetail.searchInput.fill("hhhhhh");
    await expect(pageDetail.noTaskMsg).toBeVisible();
  });
});
