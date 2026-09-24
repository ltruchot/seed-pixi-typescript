// Shared Vite+ config of the games (apps/*/vite.config.ts).
import { defineConfig } from "vite-plus";

/**
 * Config of one game: dev server on `port`, preview on `port + 1`.
 * Relative base by default so dist/ works under any sub-path (GitHub Pages,
 * itch.io...); set BASE to force one: `BASE=/my-game/ vp build`.
 */
export const gameApp = (port: number) =>
  defineConfig({
    base: process.env["BASE"] ?? "./",
    // host: reachable from Windows when the server runs in WSL; strictPort:
    // fail loudly instead of silently moving to another port.
    server: { host: true, port, strictPort: true },
    preview: { host: true, port: port + 1, strictPort: true },
    test: { include: ["tests/**/*.test.ts"] },
  });
