import { Page } from "@playwright/test";

export class ProjectPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  //getter method

  get stepIndicator() {
    return this.page.getByTestId("step-indicator");
  }
  get errorAlert() {
    return this.page.getByRole("alert");
  }
  get backLink() {
    return this.page.getByRole("link", { name: /back/i });
  }
  get projectTitle() {
    return this.page.getByRole("heading", { name: /New Project/i });
  }

  get projectName() {
    return this.page.getByLabel("Project Name");
  }

  get nextBtn() {
    return this.page.getByRole("button", { name: /next/i });
  }
  get descriptionTitle() {
    return this.page.getByLabel("Description");
  }
  get backBtn() {
    return this.page.getByRole("button", { name: /Back/i });
  }
  get createProject() {
    return this.page.getByRole("button", { name: /Create Project/ });
  }

  //Action
  async goto() {
    await this.page.goto("/projects/new");
  }
  async fillStep1(name: string) {
    await this.projectName.fill(name);
    await this.nextBtn.click();
  }
  async fillStep2(des: string) {
    await this.descriptionTitle.fill(des);
    await this.createProject.click();
  }
  async createProjectBTN(name: string, des: string) {
    await this.fillStep1(name);
    await this.fillStep2(des);
  }
}
