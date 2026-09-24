---
name: e2e
description: End-to-end tests of a game with Playwright (apps/*/e2e/*.e2e.ts) on a WebGL canvas, and taking screenshots of the running game. Load before writing or debugging an e2e test, or to look at the game in a browser.
globs:
  - "apps/*/e2e/**"
---

# e2e on a canvas

`apps/game/e2e/playwright.config.ts`: Chromium, `webServer` = `vp preview` (port 8081) on the
**build**. So: `vp -C apps/game build && vp -C apps/game run e2e` (the `ready` script does both).
Results and traces: `.local/test-results/` (gitignored). Chromium once per machine:
`vp -C apps/game exec playwright install chromium` (CI: `--with-deps`).

## No false green

A canvas has no DOM to query: "the canvas is visible" passes on a black screen. Assert on
pixels, and prove the test can fail:

- Compare `page.screenshot({ clip })` buffers. `game.e2e.ts`: the center square differs from a
  background-only corner (the hero is drawn), then after holding `ArrowRight` it equals it
  (the hero left). Wait with `expect.poll`, never a fixed delay before the first assertion.
- Collect `pageerror` and `console` errors for the whole test; assert `[]` at the end.
- After writing a test, break the game on purpose (e.g. speed 0), rebuild, see it fail, revert.

## Traps

| Symptom                                                         | Cause                                                       | Fix                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| Lint `no-conditional-in-test` on an `if` in a `page.on` handler | any condition inside `test()`                               | a module-level helper (`collectErrors(page)`)       |
| `require-await` on `expect.poll(async () => helper())`          | the arrow only returns a promise                            | `expect.poll(() => helper())`                       |
| The test sees the old game                                      | e2e runs on `dist/`, not the dev server                     | `vp -C apps/game build` first                       |
| `Port 8081 is already in use`                                   | a `vp preview` left running (locally `reuseExistingServer`) | stop it by PID, skill `vp` ("Dev server under WSL") |
| "BEWARE: your OS is not officially supported by Playwright"     | WSL distro newer than Playwright's list                     | harmless: the ubuntu24.04 build runs                |

## Just looking at the game

Take a screenshot to see a visual change: a one-off test in `e2e/` that calls
`page.screenshot({ path: "../../.local/screenshots/x.png" })`, run it, read the PNG, delete
the test.
