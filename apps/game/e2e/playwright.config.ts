// End-to-end tests of the production build (run `vp build` first): the real
// game in Chromium, driven with the keyboard.
import { defineConfig, devices } from "@playwright/test";

const url = "http://localhost:8081";

export default defineConfig({
  testDir: ".",
  testMatch: "**/*.e2e.ts",
  outputDir: "../../../.local/test-results",
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  reporter: process.env["CI"] === undefined ? "list" : "github",
  use: { baseURL: url, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: {
    command: "vp preview",
    cwd: "..",
    url,
    reuseExistingServer: process.env["CI"] === undefined,
  },
});
