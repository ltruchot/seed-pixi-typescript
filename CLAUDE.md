> Session handoff: read `TODO.md` first — where the last session stopped, and what is left.
> Open a `todo/` file only for the item you work on. An item done → delete its line and its `todo/` file.

# seed-pixi-typescript — PixiJS v8 game seed (Vite+ workspace)

A "ready to dev" seed for amateur web game makers: clone, `vp install`, `vp -C apps/game dev`,
move the hero. Public repo with GitHub stars: keep it small, readable and working.

- `apps/game`: the seed game, a hero moved with the keyboard. Template for new games.
- `packages/vite-config`: `gameApp(port)`, the shared Vite+ config of every game.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Rules

- The developer speaks French: answer in French. Everything in the repo (code, comments, docs,
  commits) is US English.
- The audience is an amateur who wants to hack a game: plain code, short comments that say why,
  no framework, no abstraction a beginner must learn first. README stays short: no walls of text.
- Micro-iterations: the smallest change that type-checks. The hook checks every edited file and
  runs the game's unit tests; read its output before the next edit.
- "Done" = `vp run ready` green. Never weaken a gate (tsconfig flag, lint rule, test) to pass:
  fix the code. Never `git commit --no-verify`.
- PixiJS is **v8**. Never write v7 (`app.view`, `Loader`, `beginFill`) and never guess an API:
  skill `pixijs` first, then `apps/game/node_modules/pixi.js/lib/**/*.d.ts`.
- Game logic = pure functions on readonly data, unit tested; Pixi display objects only in `main.ts`
  (Pixi math like `Rectangle` is fine in the logic).
- e2e asserts pixels and errors, never "the canvas exists" alone (skill `e2e`).
- Copy the pattern of an existing file before inventing a new one.
- Record a new fact or trap the SAME turn, in the file that owns it (table below): short bullets
  with the command, the error text and the fix. No narrative.
- Commit only when asked. Small conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).

## Where the detail lives — load the skill BEFORE the work

| Work                                                        | Skill / file                      |
| ----------------------------------------------------------- | --------------------------------- |
| Any PixiJS API (sprites, assets, ticker, events, filters…)  | `.claude/skills/pixijs/` (router) |
| Gameplay code in `apps/*/src`, unit tests, strictness       | `.claude/skills/game/`            |
| e2e tests, screenshots of the game                          | `.claude/skills/e2e/`             |
| package.json, vite.config.ts, deps, updates, dev/build, WSL | `.claude/skills/vp/`              |
| New game in `apps/`                                         | `.claude/skills/add-game/`        |
| Open work, follow-ups                                       | `TODO.md`                         |

`.claude/skills/pixijs*` are the official PixiJS skills, copied from the installed `pixi.js`
(`vp run skills:pixi` after a bump). Never edit them by hand.

## Environment

- No global Node/pnpm. **Vite+ owns Node and pnpm**: Node 26.10.0 in `.node-version`, pnpm 12.5.1 in `devEngines`.
- WSL2. Ports (`strictPort`): game dev 8080 / preview 8081.
- Setup from a clean clone: `vp install`, then Chromium for the e2e:
  `vp -C apps/game exec playwright install chromium` (cache in `~/.cache/ms-playwright`).

## Architecture

```
package.json, pnpm-workspace.yaml   workspace, catalog: (exact versions), minimumReleaseAge 3 days
vite.config.ts                      fmt, lint (pedantic, type-aware, readonly params), staged, skills:pixi
tsconfig.base.json                  every strict flag; each package's tsconfig.json extends it
.vite-hooks/pre-commit              vp staged
.github/workflows/ci.yml            vp install --frozen-lockfile, Chromium, vp run ready
.claude/                            settings.json (allow list, hook), hooks/check-after-edit.sh, skills/
packages/vite-config/index.ts       gameApp(port): base BASE ?? "./", host, strictPort, preview port+1, test.include
apps/game/
  index.html, src/style.css         page and full-window canvas
  src/main.ts                       Pixi: app.init, Assets.load, sprites, the wall (Graphics), ticker loop
  src/entity.ts                     pure game logic: createEntity, moveEntity (walls), hitBox
  src/input.ts                      keyboard: trackKeys (listeners), directionFrom (pure)
  src/assets/                       images, imported by URL
  tests/*.test.ts                   Vitest
  e2e/*.e2e.ts, playwright.config   Playwright on the build (vp preview)
```

## Commands

```bash
vp run ready                  # the full gate: check, unit tests, build, e2e
vp check --fix                # format + lint + types (all)
vp -C apps/game dev           # http://localhost:8080
vp -C apps/game build | preview | test
vp -C apps/game run e2e       # after the build; results in .local/test-results/
vp run skills:pixi            # refresh the official Pixi skills after a pixi.js bump
```

## Traps with no file trigger

- Stop a server you started by PID (`ss -ltnp | grep 8080`), never by `pkill -f <pattern>`.
- Long-lived state goes in `.local/` (gitignored), not `/tmp`.
- Agent shell is zsh: an unquoted `$var` does not word-split, an unmatched glob aborts the
  command, a word starting with `=` is expanded (`echo ====` → `= not found`), no `PIPESTATUS`.
  Quote globs, use an array, or run the snippet with `bash -c '…'`.
