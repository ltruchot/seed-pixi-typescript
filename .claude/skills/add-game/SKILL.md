---
name: add-game
description: Add a second game to the monorepo (apps/<game>) from the seed game, wired to the gate. Load when asked to create a new game / app / prototype in this repo.
---

# Add a game

1. `cp -r apps/game apps/<game>` without `node_modules`, `dist`.
2. `package.json`: `name` = `<game>` (the directory name), `description`.
3. `vite.config.ts`: `gameApp(<port>)`, next free even port (8080 game, 8082, 8084…); the
   preview is port + 1. Same port in `e2e/playwright.config.ts` (`url`, the preview port).
4. `index.html`: `<title>`.
5. Anything two games need (a helper, a Pixi setup) → a new `packages/<name>` with
   `"exports": "./index.ts"` (no build step, see `packages/vite-config`), not a copy.
6. `vp install`, then `vp run ready` green: the new game's `ready` runs with the others.
7. Update: CLAUDE.md (architecture, ports), `.claude/settings.json` `allow`
   (`vp -C apps/<game> test|build|run e2e`), README commands if they name `apps/game`.
