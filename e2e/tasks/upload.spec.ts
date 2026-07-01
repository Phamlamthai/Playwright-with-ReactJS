import { expect, test } from "../fixtures/data.fixture";
import { NewTask } from "../pages/NewTask";
import { PageDetail } from "../pages/PageDetail";

test.describe("Upload file with attachment", () => {
  test("Goto newTask Page at project id : 1", async ({
    adminPage,
    getTaskByProject,
  }) => {
    const fileData = {
      name: "test-attachment.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("This is a test file content"),
    };
    const pageDetail = new PageDetail(adminPage);
    await pageDetail.goto("1");
    await expect(pageDetail.newTaskBtn).toBeVisible();
    const newTasks = new NewTask(adminPage);
    await newTasks.goto("1");
    await newTasks.fillStep1(
      "Test Upload file",
      "This is a description test upload file",
    );
    await newTasks.fillStep2("todo", "low", "2026-06-30", fileData);
    const tasks = await getTaskByProject("1");
    const taskMatch = tasks.find((t) => t.title === "Test Upload file");
    await expect(adminPage).toHaveURL("/projects/1");
    await expect(pageDetail.attachVisible(taskMatch!.id)).toBeVisible();
    await expect(pageDetail.attachVisible(taskMatch!.id)).toContainText(
      fileData.name,
    );
  });
});
