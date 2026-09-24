---
name: game
description: How a game of this seed is organized (apps/<game>/src) and how to add gameplay with PixiJS v8 without breaking the strict gate. Load before editing apps/*/src or apps/*/tests.
globs:
  - "apps/*/src/**"
  - "apps/*/tests/**"
---

# A game here

PixiJS **8.21** (v8 API only). Never guess an API: load the skill `pixijs` (it routes to the
right `pixijs-*` skill), then check the types in `apps/game/node_modules/pixi.js/lib/**/*.d.ts`.
v7 habits that do not exist anymore: `new Application({...})` options (→ `await app.init({...})`),
`app.view` (→ `app.canvas`), `Loader` (→ `Assets`), `beginFill`/`endFill` (→ `.rect().fill()`),
`new Text("hi", style)` (→ `new Text({ text, style })`). Skill `pixijs-migration-v8`.

## Layout: logic apart from rendering

| File              | Role                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `src/main.ts`     | the only file that touches Pixi: `app.init`, `Assets.load`, sprites, `app.ticker.add`     |
| `src/entity.ts`   | game state as readonly data + pure functions (`moveEntity`); Pixi math only (`Rectangle`) |
| `src/input.ts`    | keyboard → held keys → direction (`KeyboardEvent.code`: physical keys, WASD = ZQSD)       |
| `src/assets/`     | images, sounds: `import url from "./assets/x.png"` (hashed, works under any base path)    |
| `tests/*.test.ts` | Vitest on the pure functions (`import … from "vite-plus/test"`)                           |

Collisions: walls are drawn with `Graphics` (`rect().fill()`) in `main.ts`; their hit boxes
are `wall.getBounds().rectangle`, passed to `moveEntity`, which tests `hitBox(entity).intersects(wall)`
one axis at a time (stops flush, slides along). Moving walls: read `getBounds()` again each frame.

The loop in `main.ts`, every frame: `state = update(state, input, ticker.deltaMS)`, then copy
the state onto the sprites. New gameplay = a new pure function + its test, then one line in the
ticker. Speeds are in pixels per **second**, scaled by `ticker.deltaMS` (frame-rate independent).

## Strictness you will meet

- `tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess` (`array[i]` is `T | undefined`),
  `exactOptionalPropertyTypes`, `verbatimModuleSyntax` (`import type` for types only).
- Lint (root `vite.config.ts`): pedantic + type-aware. Parameters must be readonly types:
  `readonly T[]`, `{ readonly x: number }`. Pixi's `Application`, `Rectangle`, `Sprite`, `Text`, `Ticker`
  are allowed as parameters; another Pixi class as a parameter → add it to that `allow` list
  with the reason, never disable the rule.
- Imports end in `.ts` (`./entity.ts`).
- Top-level `await` is fine in `main.ts` (Vite 8 targets browsers that support it).

## Checks

The Claude hook runs `vp check --fix <file>` and the game's unit tests after each edit.
Before "done": `vp run ready`. A visible change: also look at it (`vp -C apps/game dev`, or a
Playwright screenshot, skill `e2e`).
