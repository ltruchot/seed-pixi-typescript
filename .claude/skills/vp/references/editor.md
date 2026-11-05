# Editor

## VS Code and Cursor settings

Extension: `VoidZero.vite-plus-extension-pack`. In `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "[javascript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[javascriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[typescript]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "oxc.oxc-vscode" },
  "oxc.disableNestedConfig": true,
  "oxc.fmt.disableNestedConfig": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": { "source.fixAll.oxc": "explicit" }
}
```

- The `[language]` blocks are required: a user-level `[language]` setting outranks the
  workspace `editor.defaultFormatter`.
- `formatOnSaveMode` is `"file"` because Oxfmt does not format a range.
- The extension pack is on the VS Code Marketplace only, not on Open VSX: in Cursor and other
  Open VSX editors the recommendation installs nothing, and `oxc.oxc-vscode` is missing. List
  `oxc.oxc-vscode` and `vitest.explorer` in `.vscode/extensions.json`, and install them by
  name: `cursor --install-extension oxc.oxc-vscode --install-extension vitest.explorer`.

## Traps

| Symptom | Cause | Fix |
|---|---|---|
| No format on save in Cursor; `vp fmt --check` reports the file | `oxc.oxc-vscode` is not installed: see above | install it by name; `cursor --list-extensions` |
| In a multi-root window, `Oxc: Restart oxfmt Server` fails with `Pending response rejected since connection got disposed`; the `Oxc (Fmt)` output shows `Using server binary at: <another folder>/…/vite-plus/bin/vp`, then `Package not found in workspace`, and after 5 crashes the server is not restarted *(measured)* | [oxc-vscode#418](https://github.com/oxc-project/oxc-vscode/issues/418), open: the extension starts one `vp fmt --lsp`, from the first folder that has `vite-plus`, and passes it every folder | open the repo in its own window; or a standalone `oxfmt` for the window: `vp install -g oxfmt@<version>` with the version from `vp toolchain oxfmt`, and `"oxc.path.oxfmt": "${userHome}/.vite-plus/bin/oxfmt"` in the user settings. It reads each folder's `vite.config.ts` as data: a root config holding functions or plugins logs `JS functions cannot be represented as a serde_json::Value`, and that folder is not formatted |

## The TypeScript language server on TypeScript 7

TypeScript 7 ships no `tsserver`. `typescript-language-server` (used by the Claude Code
plugin `typescript-lsp` and by editors that run it from `PATH`) reports the workspace
TypeScript as unusable and falls back to a TypeScript installed next to itself *(measured)*:

```bash
vp install -g typescript-language-server
npm install -g --prefix "$(ls -d ~/.vite-plus/packages/typescript-language-server/*/ | head -1)" typescript@6
rm -f ~/.vite-plus/bin/tsc ~/.vite-plus/bin/tsserver ~/.vite-plus/bins/tsc.json ~/.vite-plus/bins/tsserver.json
```

- The last line removes the global `tsc` and `tsserver` shims npm adds, so `tsc` stays the
  project's TypeScript 7. Redo the second and third lines after
  `vp update -g typescript-language-server`.
- `Could not find a valid TypeScript installation` from the server: the second line is missing.
- Editor diagnostics then come from TypeScript 6; `vp check` and the builds are the authority.
- Never add `typescript@6` to the workspace: pnpm then creates a second `vite-plus` copy, and
  `vp run -r test` fails with `Cannot read properties of undefined (reading 'config')`.
