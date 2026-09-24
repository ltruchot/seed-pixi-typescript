---
name: vp
description: Vite+ (vp) in this monorepo (apps/*, packages/*). Always `vp <command>` instead of pnpm/npm/vite/vitest/oxlint directly. Load before touching package.json, vite.config.ts, pnpm-workspace.yaml, tsconfig*.json, or running install/dev/build/test.
globs:
  - "**/package.json"
  - "**/vite.config.ts"
  - "**/tsconfig*.json"
  - "pnpm-workspace.yaml"
---

# Vite+ here

Local docs: `node_modules/vite-plus/docs/guide/`. Online: <https://viteplus.dev/guide/>.
Vite+ 0.3.3 (pinned in `pnpm-workspace.yaml` `catalog:`) = Vite 8 + Rolldown + Vitest 4 + Oxlint +
Oxfmt + tsgolint (TypeScript 7). Vite+ owns Node and pnpm, downloaded on demand:
Node 26.10.0 in `.node-version` (`vp env pin <version> --target node-version`; CI:
`node-version` in `ci.yml`), pnpm 12.5.1 in `package.json` `devEngines.packageManager`.

## Workspace

- `apps/*`: games (Vite apps). `packages/vite-config`: `gameApp(port)`, the shared config.
- Versions live in `catalog:` (`pnpm-workspace.yaml`), exact pins, no `^`. A package lists
  `"<dep>": "catalog:"`, workspace deps `"workspace:*"`.
- `minimumReleaseAge: 4320`: a version must be 3 days old to install. A fresh release fails
  with a "minimumReleaseAge" error: take the previous one.
- The root `vite.config.ts` owns fmt, lint, staged and `run.tasks` (Vite+ ignores nested
  lint/fmt blocks; per-package lint rules go in `lint.overrides`). Each app's `vite.config.ts`
  owns its Vite/Vitest config.
- `-F`/`--filter` exists only on `vp run`. Builtins take `-C <dir>`: `vp -C apps/game dev`.

## Rule #1: `vp <command>`, never the tool underneath

| Task                     | Command                                                         | Notes                                                                           |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Install deps             | `vp install` (root)                                             | after every pull; CI: `vp install --frozen-lockfile`                            |
| Add a dep                | `vp -C apps/game add <pkg>` (`-D` dev), then move it to catalog | exact version in the catalog, `"catalog:"` in the package                       |
| Dev server               | `vp -C apps/game dev`                                           | http://localhost:8080, `strictPort`, HMR                                        |
| Production build         | `vp -C apps/game build`                                         | `apps/game/dist/`, base `./` (or `BASE=/path/ vp -C apps/game build`)           |
| Serve the build          | `vp -C apps/game preview`                                       | dev port + 1 (8081)                                                             |
| Format + lint + types    | `vp check` / `vp check --fix` (root, whole workspace)           | `vp check --fix <file>` for one file (the Claude hook does this)                |
| Unit tests               | `vp -C apps/game test`                                          | Vitest, `tests/*.test.ts`, import from `vite-plus/test`; watch: `vp test watch` |
| e2e                      | `vp -C apps/game run e2e`                                       | Playwright on the build: run `vp -C apps/game build` first (skill `e2e`)        |
| Everything ("done")      | `vp run ready` (root)                                           | `vp check` → each package's `ready` (test, build, e2e)                          |
| Pixi skills after a bump | `vp run skills:pixi`                                            | copies `pixi.js/skills` into `.claude/skills/`                                  |
| Versions                 | `vp toolchain`, `vp why <pkg>`, `vp pm view <pkg> version`      |                                                                                 |

`vp build` = the builtin; `vp run <name>` = a script or task. Scripts cannot shadow builtins.
`vp pm <cmd>` is an allowlist (view, list, audit, cache…); anything else (`pnpm patch`): the
embedded pnpm under `~/.vite-plus/package_manager/pnpm/<version>/`.

## Updating dependencies

1. `vp pm view <pkg> time --json`: latest version at least 3 days old; read its changelog.
2. Bump it in `catalog:` (vite and vite-plus together: `vite: npm:@voidzero-dev/vite-plus-core@<v>`).
3. `vp install`, then `vp run ready`. Pixi: also `vp run skills:pixi` and README "More infos".

## Traps

| Symptom                                                                      | Cause                                                                             | Fix                                                                                             |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `TS4111: Property 'X' comes from an index signature`                         | `noPropertyAccessFromIndexSignature` (tsconfig.base.json)                         | `process.env["X"]`, not `process.env.X`                                                         |
| `prefer-readonly-parameter-types` on a `ReadonlySet`/`ReadonlyMap` parameter | the rule wants deeply readonly types; a Set's methods do not count                | `readonly T[]` or a readonly object type; Pixi classes are allowed in the root `vite.config.ts` |
| `strict-void-return` on `(e) => set.add(e.code)`                             | an arrow returning a value where a `void` callback is expected                    | a block body: `(e) => { set.add(e.code); }`                                                     |
| `vitest(no-conditional-in-test)` / `consistent-function-scoping` in a test   | any `if`, `?:`, `?.`, `??` inside `it`/`test`                                     | move it to a module-level helper (`apps/game/e2e/game.e2e.ts`)                                  |
| Oxlint `no-unsafe-*` on `JSON.parse` / `res.json()`                          | `any` from the platform                                                           | type the result `unknown` and narrow it; never cast                                             |
| A `vite.config.ts` task with `*` or `&&` does nothing or fails               | vp runs task commands without a shell (it splits `&&`, no globbing)               | `sh -c '…'` (see `skills:pixi`)                                                                 |
| `vp run` spawned at runtime under a `vp run` task fails silently             | the child inherits `VP_COMMAND`                                                   | never `vp run` in a Playwright `webServer`; `vp preview` / `vp dev` there work (verified)       |
| `vp test` picks up Playwright specs                                          | Vitest collects `*.{test,spec}.ts`                                                | e2e files are `*.e2e.ts`; `gameApp` sets `test.include: ["tests/**/*.test.ts"]`                 |
| `vp dev` / `vp build` at the root: `needs a target package`                  | the root is a workspace                                                           | `vp -C apps/<game> dev`                                                                         |
| CI `vp install --frozen-lockfile`: `1 dependency was added: node@runtime:…`  | `devEngines.runtime` in package.json: pnpm then manages Node too, in the lockfile | pin Node in `.node-version`, not `devEngines.runtime`                                           |
| `node: command not found`                                                    | no global Node: Vite+ owns it                                                     | `vp node <file>`, or `vp env setup` for the shims                                               |

## Git hooks

`"prepare": "vp config"` installs the dispatcher in `.vite-hooks/_` (ignored). The project hook
`.vite-hooks/pre-commit` runs `vp staged` (the `staged` block of the root `vite.config.ts`:
`vp check --fix` on staged files). Never `git commit --no-verify`.

## Dev server under WSL

`server: { host: true, port, strictPort: true }` (in `gameApp`): binds 0.0.0.0 so VS Code/Cursor
can forward it; `strictPort` fails loudly instead of moving to another port. Stop a server you
started by PID (`ss -ltnp | grep 8080`), never `pkill -f` a pattern (it matches your own shell).
`Port 8080 is already in use` while `ss -ltn` shows nothing: a Windows process holds it (WSL
shares the network): `netstat.exe -ano -p tcp | grep ':8080 '`, then `tasklist.exe /FI "PID eq <pid>"`.
Cursor/VS Code keep auto-forwarded ports bound: Ports panel → Stop Forwarding Port.

## VS Code

`.vscode/settings.json`: Oxc formats and fixes on save, from `vite.config.ts`. The `[language]`
blocks are required (a user-level Prettier would win otherwise); `formatOnSaveMode: "file"`
because Oxfmt cannot format a range.
