import type { Task } from "../../src/types/index";
import { test as base } from "./auth.fixture";
type DataFixture = {
  getTaskByProject: (projectId: string) => Promise<Task[]>;
};

export const test = base.extend<DataFixture>({
  getTaskByProject: async ({ request }, use) => {
    const fn = async (projectId: string): Promise<Task[]> => {
      const res = await request.get(
        `http://localhost:3001/tasks?projectId=${projectId}`,
      );
      return res.json();
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(fn);
  },
});

export { expect } from "@playwright/test";
