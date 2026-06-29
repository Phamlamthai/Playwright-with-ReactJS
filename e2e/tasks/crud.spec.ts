import { expect, test } from "../fixtures/auth.fixture";
import { PageDetail } from "../pages/PageDetail";

test.describe("Delete each tasks successfully", () => {
  test("delete task when click button delete", async ({ adminPage }) => {
    const res = await adminPage.request.post("http://localhost:3001/tasks", {
      data: {
        title: "Task to delete",
        description: "This task will be deleted",
        status: "todo",
        priority: "low",
        projectId: 1,
        assigneeId: 1,
        dueDate: "2026-06-30",
        attachment: null,
      },
    });
    const data = await res.json();
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await pageDetail.deleteBtnTask(data.id).click();
    await expect(pageDetail.taskItem(data.id)).not.toBeVisible();
  });
});
