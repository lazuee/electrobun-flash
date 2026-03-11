// Interactive Window Tests - GPU disabled verification

import { defineTest } from "../../test-framework/types";
import { BrowserWindow } from "electrobun/bun";

export const windowInteractiveTests = [
  defineTest({
    name: "Window with GPU disabled",
    category: "Window (Interactive)",
    description: "Verify that disableGPU in electrobun.config.ts actually disables GPU acceleration for CEF",
    interactive: true,
    timeout: 120000,
    async run({ log, showInstructions, waitForUserVerification }) {
      await showInstructions([
        "A CEF window will open — GPU should be disabled app-wide via electrobun.config.ts",
        "The page will auto-check GPU status on load",
        "You can click 'Check GPU Status' to re-check",
        "Verify that GPU shows as 'Disabled' and WebGL uses software fallback",
        "Click Pass if GPU is confirmed disabled, Fail otherwise",
      ]);

      log("Opening CEF window (GPU disabled via build config)");

      await new Promise<void>((resolve) => {
        const win = new BrowserWindow({
          title: "GPU Disabled Test",
          url: "views://playgrounds/gpu-disabled/index.html",
          renderer: "cef",
          frame: { width: 500, height: 550, x: 150, y: 100 },
        });

        win.setAlwaysOnTop(true);

        win.on("close", () => {
          log("Test window closed");
          resolve();
        });
      });

      const result = await waitForUserVerification();
      if (result.action === "fail") {
        throw new Error(result.notes || "GPU was not disabled — user marked test as failed");
      }
      if (result.action === "retest") {
        throw new Error("RETEST: User requested to run the test again");
      }

      log("GPU disabled test completed — verified by user");
    },
  }),
  defineTest({
    name: "Flash plugin support",
    category: "Window (Interactive)",
    description: "Verify that PPAPI Flash plugin loads and runs correctly in a CEF window",
    interactive: true,
    timeout: 120000,
    async run({ log, showInstructions, waitForUserVerification }) {
      await showInstructions([
        "A CEF window will open loading a Flash-based website (ultrasounds.com)",
        "Wait for the page to load — Flash content should render without prompts",
        "Verify that Flash content is visible and interactive (no blocked-plugin icon)",
        "Click Pass if Flash is working, Fail otherwise",
      ]);

      log("Opening CEF window with Flash content");

      await new Promise<void>((resolve) => {
        const win = new BrowserWindow({
          title: "Flash Plugin Test",
          url: "https://www.ultrasounds.com/",
          renderer: "cef",
          frame: { width: 900, height: 700, x: 150, y: 100 },
        });

        win.setAlwaysOnTop(true);

        win.on("close", () => {
          log("Test window closed");
          resolve();
        });
      });

      const result = await waitForUserVerification();
      if (result.action === "fail") {
        throw new Error(result.notes || "Flash plugin did not work — user marked test as failed");
      }
      if (result.action === "retest") {
        throw new Error("RETEST: User requested to run the test again");
      }

      log("Flash plugin test completed — verified by user");
    },
  }),
];
