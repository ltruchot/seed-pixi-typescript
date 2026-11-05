---
name: vp-local
description: This repo's Vite+ setup, on top of the shared `vp` skill - the game app and its ports, `gameApp`, the catalog and the 3-day release age, the dependency update steps, the Pixi skills sync, and the traps met here. Load with `vp` before touching package.json, vite.config.ts, pnpm-workspace.yaml, tsconfig*.json, or running install/dev/build/test.
paths:
  - "**/package.json"
  - "**/vite.config.ts"
  - "**/tsconfig*.json"
  - "pnpm-workspace.yaml"
---

# Vite+ in this repo

The `vp` skill holds what is true of Vite+ anywhere; it is installed by `qol-mini` and never
edited here. This file holds what is true of this repo only.

## Workspace

- `apps/*`: games (Vite apps). `packages/vite-config`: `gameApp(port)`, the shared config.
  It sets `server: { host: true, port, strictPort: true }`, the preview port (dev port + 1) and
  `test.include: ["tests/**/*.test.ts"]`.
- Versions live in `catalog:` (`pnpm-workspace.yaml`), exact pins, no `^`. Vite+ and pnpm
  versions are read there and in `package.json` `devEngines.packageManager`.
- `minimumReleaseAge: 4320`: a version must be 3 days old to install. A fresh release fails
  with a "minimumReleaseAge" error: take the previous one.
- Node is pinned in `.node-version` (`vp env pin <version>`); CI reads it through Vite+
  (`setup-vp` with no `node-version`). `runtimeOnFail: ignore` keeps pnpm from managing Node:
  without it, CI `vp install --frozen-lockfile` fails on `1 dependency was added: node@runtime:…`.
- The root `vite.config.ts` owns fmt, lint, staged and `run.tasks`; per-package lint rules go
  in `lint.overrides`. Each app's `vite.config.ts` owns its Vite/Vitest config.

## Commands of this repo

| Task                     | Command                   | Notes                                                                    |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------ |
| Dev server               | `vp -C apps/game dev`     | http://localhost:8080                                                    |
| Production build         | `vp -C apps/game build`   | `apps/game/dist/`, base `./` (or `BASE=/path/ vp -C apps/game build`)    |
| Serve the build          | `vp -C apps/game preview` | 8081                                                                     |
| Unit tests               | `vp -C apps/game test`    | `tests/*.test.ts`                                                        |
| e2e                      | `vp -C apps/game run e2e` | Playwright on the build: run `vp -C apps/game build` first (skill `e2e`) |
| Everything ("done")      | `vp run ready` (root)     | `vp check` → each package's `ready` (test, build, e2e)                   |
| Pixi skills after a bump | `vp run skills:pixi`      | copies `pixi.js/skills` into `.claude/skills/`                           |
| One file                 | `vp check --fix <file>`   | the Claude hook does this                                                |

`vp pm` does not forward `patch`-like commands outside its list: the embedded pnpm is under
`~/.vite-plus/package_manager/pnpm/<version>/`.

## Updating dependencies

1. `vp pm view <pkg> time --json`: latest version at least 3 days old; read its changelog.
2. Bump it in `catalog:` (vite and vite-plus together: `vite: npm:@voidzero-dev/vite-plus-core@<v>`).
3. `vp install`, then `vp run ready`. Pixi: also `vp run skills:pixi` and README "More infos".

## Traps met here

| Symptom                                                                      | Cause                                                              | Fix                                                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `prefer-readonly-parameter-types` on a `ReadonlySet`/`ReadonlyMap` parameter | the rule wants deeply readonly types; a Set's methods do not count | `readonly T[]` or a readonly object type; Pixi classes are allowed in the root `vite.config.ts` |
| `vitest(no-conditional-in-test)` / `consistent-function-scoping` in a test   | any `if`, `?:`, `?.`, `??` inside `it`/`test`                      | move it to a module-level helper (`apps/game/e2e/game.e2e.ts`)                                  |
| `vp run` spawned at runtime under a `vp run` task fails silently             | measured here: the child inherits `VP_COMMAND`                     | never `vp run` in a Playwright `webServer`; `vp preview` / `vp dev` there work                  |
| `vp test` picks up Playwright specs                                          | Vitest collects `*.{test,spec}.ts`                                 | e2e files are `*.e2e.ts`; `gameApp` sets `test.include`                                         |
| A `vite.config.ts` task with `*` in its command did nothing                  | measured here on the Vite+ version of that time                    | `sh -c '…'` (see `skills:pixi`); recheck after a Vite+ bump                                     |

## Git hooks

The `staged` block of the root `vite.config.ts` runs `vp check --fix` on staged files. Never
`git commit --no-verify`.
