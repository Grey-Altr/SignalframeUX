import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
    // Grant clipboard permissions so copy-to-clipboard tests work
    permissions: ["clipboard-read", "clipboard-write"],
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Enable SwiftShader software WebGL in headless Chromium so WebGL-dependent
        // tests (SG-01, AC-12) pass without a physical GPU in CI / headless mode.
        launchOptions: {
          args: ["--use-gl=swiftshader", "--enable-webgl"],
        },
      },
    },
  ],
  // Dev server already running — do not start a new one
  webServer: process.env.CI ? {
    command: "pnpm build && pnpm start",
    port: 3000,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  } : undefined,
});
