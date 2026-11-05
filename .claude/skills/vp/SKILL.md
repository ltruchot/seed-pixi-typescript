---
name: vp
description: Vite+ (vp) in a pnpm workspace. Run `vp <command>` instead of pnpm, npm, node, vite, vitest, oxlint, oxfmt or tsx directly. Use before touching package.json, vite.config.ts, tsconfig*.json, pnpm-workspace.yaml or .vite-hooks/, and before running install, dev, build, test, lint, a task or a script.
paths:
  - "**/package.json"
  - "**/vite.config.ts"
  - "**/tsconfig*.json"
  - "pnpm-workspace.yaml"
  - ".vite-hooks/*"
---

# Vite+ (`vp`)

Written against Vite+ 1.5: Vite 8, Rolldown, Vitest 5, Oxlint, Oxfmt, tsgolint, tsdown,
Vite Task. `vp --version` and `vp toolchain` print what this project runs.

Docs: <https://viteplus.dev/guide/>, for example `/guide/vpx`, `/guide/lint`,
`/guide/commit-hooks`. Read the page before guessing a flag. The copy in
`node_modules/vite-plus/docs/guide/` and `docs/config/` matches the installed version: use it
offline, and the online page when the two differ.

## Rule 1: `vp <command>`, never the tool underneath

| Task | Command | Notes |
|---|---|---|
| Install | `vp install` | CI: `vp install --frozen-lockfile`, which fails if the lockfile would change |
| Add, remove a dependency | `vp -C apps/game add <pkg>` (`-D` dev, `-E` exact), `vp remove <pkg>` | then move the version to the catalog, see below |
| Dev server | `vp -C apps/game dev` | <http://localhost:8080> |
| Production build | `vp -C apps/game build` | apps; libraries build with `vp pack` |
| Serve the build | `vp -C apps/game preview` | after `vp build` |
| Format, lint, types | `vp check`, `vp check --fix` | from the root, whole workspace; `vp check --fix <file>` for one file |
| Tests | `vp -C apps/game test` | runs once; `vp test watch` watches; `vp test run --coverage` |
| A script or a task | `vp run <name>`, short form `vpr <name>` | `package.json` script or `run.tasks` entry |
| A TypeScript or JavaScript file | `vpx <file>`, `vpx --watch <file>` | on the project's Node, with the oxc-node loader; no `tsx`, no `ts-node` |
| A one-off binary | `vp exec <bin>` (local), `vp dlx <pkg>` or `vpx <pkg>` (downloaded) | `vp dlx` adds no dependency |
| Versions | `vp toolchain`, `vp why <pkg>`, `vp outdated`, `vp info <pkg> version` | `vp why` shows the package-manager graph only |

- `vp build` is the builtin and cannot be overridden; `vp run build` is the script or task of
  that name. Same for `dev`, `test`, `preview`, `lint`, `fmt`, `check`, `pack`.
- `vp pm <subcommand>` forwards a fixed list to the package manager (`view`, `list`, `audit`,
  `cache`, `config`, `publish`, `pack`, `ci`, `approve-builds`, `patch`, ...), not anything.
  Extra arguments go after `--`. `vp pm --help` prints the list.
- `vpx <file>` reads tsconfig `paths`, `.js` imports of `.ts` files and Node options such as
  `--env-file-if-exists=.env`. A missing file is an error, never a download.

## Targeting a package

- `vp -C <dir> <command>` runs any command as if started in `<dir>`. Use it for builtins.
- A positional directory (`vp dev apps/game`) only sets Vite's `root` and exists on `dev`,
  `build` and `preview` only. Prefer `-C`.
- `vp test <arg>` filters test files, and `vp pack <arg>` names entry files: neither targets a
  package.
- At the workspace root, a bare `vp dev`, `vp build`, `vp preview` or `vp pack` asks which
  package, and in a non-interactive shell exits 1 with `needs a target package`.
  `defaultPackage` in the root `vite.config.ts` fixes the target.
- `-F`, `--filter` selects packages on `vp run`, `vp exec` and the package-manager commands
  only. On `vp dev` and `vp build`, `-f` filters debug logs.

## `vp run`

- `-r` every package, `-t` this package and its dependencies, `-F <pattern>` pnpm filter
  syntax, `-w` the workspace root, `<package>#<task>` one task of one package.
- `--parallel` drops dependency ordering. `--cache` and `--no-cache` override the cache.
- A task name lives in `vite.config.ts` (`run.tasks`) or in `package.json`, never in both.
- Tasks are cached by default, scripts are not. Set `cache: false` on a dev server and on
  anything that must always run.
- A task runs in a clean environment: only a short list (`PATH`, `HOME`, `CI`, ...) passes.
  Another variable goes in `cache.env` (part of the cache key) or `cache.untrackedEnv`.
- A command string is read by a shell. `&&` chains are split into sub-tasks cached one by
  one. An array `command` is a sequence of commands, not an argument vector.

## Configuration: one `vite.config.ts`

- `import { defineConfig } from "vite-plus"` in config files. Other files keep
  `from "vite"`. Tests import from `vite-plus/test`.
- Blocks: `run` (with `run.tasks`), `fmt`, `lint`, `check`, `test`, `pack`, `staged`, `create`,
  plus `defaultPackage`, beside Vite's own `server`, `build`, `preview`, `plugins`.
- No `vitest.config.ts`, `tsdown.config.ts`, `.oxlintrc.json` or `.oxfmtrc.json`.
- Keep `lint` and `fmt` in the root config. `vp check` reads the root blocks only. A rule for
  one package goes in `lint.overrides` or `fmt.overrides`, with globs relative to the root.
- Type checks run in `vp check` only when `lint.options.typeAware` and
  `lint.options.typeCheck` are on. Without them `vp check` passes on a type error.
- Vitest collects `*.test.*` and `*.spec.*`. When Playwright specs share the repo, set
  `test.include` or name them `*.e2e.ts`.

## A Node app without Vite

A back end has no `index.html` and no `vite.config.ts`, and no `vite` dependency; it keeps
`vite-plus` for `vpx`, `vp test` and `vp check`. `vp create` scaffolds a web app even for a
back end: remove `index.html`, `public/` and the DOM code.

- `"dev": "vpx --env-file-if-exists=.env --watch src/main.ts"`, `"start"` the same without
  `--watch`. `--env-file-if-exists` is a Node option: no dotenv dependency.
- No `build` script: `vp check` type-checks it, and `vp run -r build` skips the package.
- `tsconfig.json`: `"types": ["node"]`, `@types/node` from the catalog.

## Dependencies in a pnpm workspace

- Shared versions live in `catalog:` in `pnpm-workspace.yaml`; a package lists
  `"<dep>": "catalog:"`, a workspace dependency `"workspace:*"`.
- `minimumReleaseAge` is in minutes and defaults to 1440 since pnpm 11. A release younger
  than that fails to install: take the previous version, or list it in
  `minimumReleaseAgeExclude` by exact version (`"@voidzero-dev/vite-plus-core@1.5.0"`, one
  line per platform package) when the reason is known. A bare name exempts every future
  release.
- Exact versions: `vp add -E`, or `savePrefix: ""`.

## Upgrading Vite+

- Global CLI: `vp upgrade`, `vp upgrade --check`. Project: `vp migrate` with a global CLI
  newer than the project re-pins `vite-plus`, the `vite` alias to
  `@voidzero-dev/vite-plus-core` and the `vitest@*` override, across the workspace. It skips
  the first-time setup; `--full` runs it.
- By hand: the three together, wherever they are declared (catalog, `overrides`), then the
  `vitest@*` override to the version `vp toolchain vitest` prints, then `vp install`.
- An out-of-date `vitest` pin installs the previous runner beside the bundled one and splits
  mocks and `expect` between two copies.
- Reference: `node_modules/vite-plus/docs/guide/upgrade-project.md`.

## Node and the package manager

- Node resolves from the nearest of, in order: `.node-version`, `devEngines.runtime`,
  `engines.node`, `.nvmrc`. `vp env pin <version>` writes the pin, `vp env current` shows
  what resolved and from where, `vp env doctor` diagnoses.
- The package manager comes from `packageManager`, then `devEngines.packageManager`. With
  both, `packageManager` drives and a mismatch warns.
- In system-first mode for the package manager (`vp env off pnpm`), Vite+ runs the `pnpm` on
  `PATH`, which may not be the pinned one. `vp env on pnpm` restores managed mode;
  `vp env doctor pnpm` shows the mode.
- `vp env`, `vp node <file>`, `vp upgrade` need the global CLI. `node: command not found`
  means no global Node: `vpx <file>` or `vp node <file>`.

## Git hooks

- `"prepare": "vp config"` installs the dispatcher in `.vite-hooks/_` (ignored by git) and sets
  `core.hooksPath`. It writes no hook: `.vite-hooks/pre-commit` is a committed file that runs
  `vp staged`, which reads the `staged` block of the root `vite.config.ts`.
- `staged`: for each glob, the commands run in order with the staged paths appended, and stop
  at the first failure. A check that must see a file before `vp check --fix` rewrites it comes
  first.
- Another hook is a committed `.vite-hooks/<hook>` (`commit-msg`, ...), run with `sh`, no
  shebang needed. Inside a hook `vp` is the project-local CLI, which has no `vp node`: run
  TypeScript with `vpx <file>`.
- `vp hooks status` shows the preference, `core.hooksPath` and the project hooks.
- Never `git commit --no-verify`, `VP_GIT_HOOKS=0` or `vp hooks disable`: fix the content.

## More

- [references/traps.md](references/traps.md): lint and type errors that recur, task and pack
  failures, a dev server port that stays busy. Read it when a `vp check`, `vp run` or port
  error is not obvious.
- [references/editor.md](references/editor.md): VS Code and Cursor settings, the Oxc
  extension, the TypeScript language server on TypeScript 7.
