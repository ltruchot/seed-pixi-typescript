import { defineConfig } from "vite-plus";

// Workspace root: format, lint and staged checks for every package (Vite+
// does not apply nested lint/fmt blocks). Game configs: apps/*/vite.config.ts,
// built on packages/vite-config.
export default defineConfig({
  staged: {
    "*.{ts,js,json,css,html,md,yaml}": "vp check --fix",
  },
  fmt: {
    // Official PixiJS skills, copied as-is from node_modules/pixi.js/skills.
    ignorePatterns: [".claude/skills/pixijs*/**"],
  },
  lint: {
    ignorePatterns: ["**/dist/**", "**/test-results/**", "**/playwright-report/**"],
    plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "promise", "node", "vitest"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    categories: {
      correctness: "error",
      suspicious: "error",
      pedantic: "error",
      perf: "error",
    },
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      // CSS imports are side effects by design (Vite bundles them).
      "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
      // Pixi display objects and Playwright pages are mutable by design: the
      // game logic works on plain readonly data (apps/game/src/entity.ts), and
      // only the render step touches them. Pixi's Rectangle is the hit box of
      // collisions (`intersects`); the game logic never mutates it.
      // Everything else must be readonly.
      "typescript/prefer-readonly-parameter-types": [
        "error",
        {
          ignoreInferredTypes: true,
          allow: [
            { from: "package", package: "pixi.js", name: "Application" },
            { from: "package", package: "pixi.js", name: "Rectangle" },
            { from: "package", package: "pixi.js", name: "Sprite" },
            { from: "package", package: "pixi.js", name: "Text" },
            { from: "package", package: "pixi.js", name: "Ticker" },
            { from: "package", package: "playwright-core", name: "Page" },
          ],
        },
      ],
    },
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
      reportUnusedDisableDirectives: "error",
    },
  },
  run: {
    tasks: {
      // The official PixiJS agent skills ship in the pixi.js package: copy the
      // installed version's into .claude/skills after bumping pixi.js.
      "skills:pixi": {
        // sh: vp runs commands without a shell, so no glob expansion.
        command:
          "sh -c 'rm -rf .claude/skills/pixijs* && cp -r apps/game/node_modules/pixi.js/skills/pixijs* .claude/skills/'",
        cache: false,
      },
    },
  },
});
