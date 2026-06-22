import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 1,

  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry", // ghi trace để debug bằng Trace Viewer khi fail
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: [
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: true,
    },
    {
      command: "npm run server",
      url: "http://localhost:3001",
      reuseExistingServer: true,
    },
  ],
});
