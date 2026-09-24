# A seed for PixiJS + TypeScript games

A "ready to dev" environment to start a web game with [PixiJS](https://pixijs.com/) v8, TypeScript and [Vite+](https://viteplus.dev/). Clone it, run it, move the hero, then make it yours.

## Quickstart

`vp` is the command line of [Vite+](https://viteplus.dev/): one tool to install packages, run the dev server, test, lint and build. It also downloads the right Node.js and pnpm, so you don't need to install them. Install it once:

```bash
curl -fsSL https://vite.plus | bash       # macOS, Linux, WSL
irm https://vite.plus/ps1 | iex           # Windows (PowerShell)
```

Then:

```bash
git clone https://github.com/ltruchot/seed-pixi-typescript.git my-game
cd my-game
vp install
vp -C apps/game dev
```

Open http://localhost:8080/ and move the hero with the arrows (or WASD / ZQSD).

## Where to hack

- `apps/game/src/main.ts`: the Pixi app, sprites and game loop.
- `apps/game/src/entity.ts`: the game logic (plain data and functions, unit tested).
- `apps/game/src/assets/`: your images; `import url from "./assets/x.png"`.

## Commands

| Command                   | What                                                 |
| ------------------------- | ---------------------------------------------------- |
| `vp -C apps/game dev`     | dev server with hot reload, http://localhost:8080/   |
| `vp -C apps/game build`   | production build in `apps/game/dist/` (static files) |
| `vp -C apps/game preview` | serve the build, http://localhost:8081/              |
| `vp -C apps/game test`    | unit tests (Vitest)                                  |
| `vp -C apps/game run e2e` | browser tests on the build (Playwright)              |
| `vp check --fix`          | format, lint, type check                             |
| `vp run ready`            | everything above: run it before you commit           |

First e2e run: `vp -C apps/game exec playwright install chromium`.
TypeScript is as strict as it gets: the compiler and the linter will teach you a lot.
Working with Claude Code: see `CLAUDE.md` and `.claude/skills/` (official PixiJS skills included).

## More infos

Current Pixi version: v8.21.0

Last full update: 2026-09 (Node 26, TypeScript 7, Vite+ 0.3)

License: [MIT](LICENSE).
