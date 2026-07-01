import type { Page } from "@playwright/test";

export class NewTask {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  // get backBtn() {
  //     return this.page.getByRole()
  // }
  get newTask() {
    return this.page.getByText("New Task");
  }
  get taskTitle() {
    return this.page.getByLabel("Task Title");
  }
  get stepIndicator() {
    return this.page.getByTestId("step-indicator");
  }
  get description() {
    return this.page.getByLabel("Description");
  }
  get nextBtn() {
    return this.page.getByRole("button", { name: /next/i });
  }
  get errorAlert() {
    return this.page.getByRole("alert");
  }

  //step 2 indicator
  get statusTitle() {
    return this.page.getByLabel("Status");
  }
  get priorityTitle() {
    return this.page.getByLabel("Priority");
  }
  get dateTitle() {
    return this.page.getByLabel("Due Date");
  }
  get attachmentTitle() {
    return this.page.getByLabel("Attachment (optional)");
  }
  get backBtnStep2() {
    return this.page.getByRole("button", { name: /← Back/i });
  }
  get createTaskBtnStep2() {
    return this.page.getByRole("button", { name: /Create Task/i });
  }

  async goto(projectId: string) {
    await this.page.goto(`/projects/${projectId}/tasks/new`);
  }
  async fillStep1(title: string, des: string) {
    await this.taskTitle.fill(title);
    await this.description.fill(des);
    await this.nextBtn.click();
  }
  async fillStep2(
    status: string,
    priority: string,
    date: string,
    file?: {
      name: string;
      mimeType: string;
      buffer: Buffer;
    },
  ) {
    await this.statusTitle.selectOption(status);
    await this.priorityTitle.selectOption(priority);
    await this.dateTitle.fill(date);
    if (file) {
      await this.attachmentTitle.setInputFiles(file);
    }
    await this.createTaskBtnStep2.click();
  }
}
