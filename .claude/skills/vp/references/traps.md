# Traps

Each row names a symptom, its cause and the fix. Rows marked *measured* come from projects
using this skill, not from the Vite+ docs.

## `vp check`

| Symptom | Cause | Fix |
|---|---|---|
| `TS4111: Property 'X' comes from an index signature` | `noPropertyAccessFromIndexSignature` | `process.env["X"]`, not `process.env.X` |
| Oxlint `no-unsafe-*` on `JSON.parse` or `res.json()` | the platform returns `any` | type the result `unknown` and narrow it; never cast |
| `strict-void-return` on `(e) => set.add(e.code)` | an arrow returns a value where a `void` callback is expected | a block body: `(e) => { set.add(e.code); }` |
| `vitest(no-conditional-in-test)` | an `if`, `?:`, `?.` or `??` inside `it` or `test` | move the logic to a module-level helper |
| `consistent-function-scoping` on a helper inside `page.evaluate` | the callback runs in the browser and cannot use module helpers | inline the code in the callback |
| A package-level `lint` or `fmt` block changes nothing in `vp check` | `vp check` reads the root blocks only | `lint.overrides` or `fmt.overrides` in the root config |
| Type-aware lint fails on `compilerOptions.baseUrl` | tsgolint does not support it | use `paths` without `baseUrl` |
| `TS2591: Cannot find name 'process'` on a `.ts` file outside every package (a script under `.claude/`, `scripts/`) *(measured)* | no tsconfig gives that file Node's types | a `tsconfig.json` beside it: `{ "extends": "<relative>/tsconfig.base.json", "compilerOptions": { "types": ["node"] }, "include": ["*.ts"] }` |

## Running

| Symptom | Cause | Fix |
|---|---|---|
| `needs a target package`, exit 1 | a bare builtin at the workspace root, in a non-interactive shell | `vp -C <dir> <command>`, or `defaultPackage` |
| A task does not see an environment variable | tasks run in a clean environment | `cache.env` or `cache.untrackedEnv` on the task |
| A task prints nothing new and ends at once | cache hit | `vp run --no-cache <task>`; `cache: false` if it must always run |
| `EBUSY` or `Device or resource busy` when a task starts a binary, and the same command passes outside `vp run` *(measured)* | the task cache tracks file access, and a statically linked binary cannot start under it | `vp run --no-cache <task>`, or `cache: false` on the task |
| `vp test` runs the Playwright specs | Vitest collects `*.spec.*` | `test.include`, or name them `*.e2e.ts` |
| `vp install --frozen-lockfile` fails in CI on a `node@runtime` entry *(measured)* | pnpm 11+ manages `devEngines.runtime` itself and records it in the lockfile | pin Node in `.node-version`, or `pnpm config set --global runtimeOnFail ignore` |
| `vp install` asks to remove and reinstall the modules directories, and pnpm prints an older version than the pin *(measured)* | the package manager is in system-first mode: Vite+ runs the `pnpm` on `PATH` | `vp env on pnpm`, then `vp env doctor pnpm` shows managed mode |
| `vp run <script> -- <arg>` passes `--` to the script as an argument *(measured)* | `vp run` forwards every argument after the name | drop the `--`: `vp run <script> <arg>` |
| A `vp run` or `vp build` started at runtime by a process under a `vp run` task exits 1 with no message, or uses the wrong root *(measured)* | the child inherits the `VP_COMMAND` marker; nesting is supported inside a `package.json` script only | build in the script; in a Playwright `webServer.command`, start a binary or `vp dev`, never `vp run` |
| A `console.log` in a test prints nothing *(measured)* | the reporter does not show the test's stdout | append to a git-ignored file, read it after the run, remove the calls |
| `ERR_PNPM_IGNORED_BUILDS: <pkg>` | a dependency has an install script that pnpm did not run | `allowBuilds` in `pnpm-workspace.yaml`, `true` or `false` per package, after reading the script |

## Dev server

`server: { host: true, port: 8080, strictPort: true }`: `host: true` listens on every
address, which an editor on another host needs to forward the port (WSL, a container, SSH);
`strictPort` exits when the port is taken instead of moving to the next one.

| Symptom | Cause | Fix |
|---|---|---|
| `Port 8080 is already in use`, and you started the server | an earlier run still holds it | find the PID with `ss -ltnp \| grep 8080` and stop that PID; never `pkill -f <pattern>`, which matches your own shell |
| Same error under WSL while `ss -ltn` shows nothing *(measured)* | a Windows process holds the port: WSL shares the network | `netstat.exe -ano -p tcp \| grep ':8080 '`, then `tasklist.exe /FI "PID eq <pid>"` |
| The holder is the editor *(measured)* | VS Code and Cursor keep an auto-forwarded port bound after the server stops | Ports panel, Stop Forwarding Port; `remote.autoForwardPorts` and `remote.restoreForwardedPorts` to `false` in the user settings |

## `vp pack`

| Symptom | Cause | Fix |
|---|---|---|
| `TypeScript is not installed ... or enable isolatedDeclarations` *(measured)* | declarations are written by Oxc, which needs `isolatedDeclarations` | `"isolatedDeclarations": true` in the package `tsconfig.json`; never install `typescript` for it |
| `TS9010: Variable must have an explicit type annotation with --isolatedDeclarations` at build, not in `vp check` *(measured)* | an export without a written type | write the type on the `export const` |
| Hundreds of type errors on every import of a workspace library, right after a `vp pack` was killed *(measured)* | the killed build left that library's `dist/` empty, and its `exports` point there | `vp -C <library> pack` again, then `vp check` |
| The type check passes locally and fails on a clean clone or in CI on imports of a workspace library *(measured)* | the importer resolves the library through its `exports`, that is its `dist/`, absent on a clean tree | build the library before `vp check` in the gate; prove the gate from a tree without `dist/` |
