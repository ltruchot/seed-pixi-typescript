# TODO

## Where we stopped

2026-09-24: migrated from webpack 5 / Pixi 6.0.4 / TS 4.2 / Node 14 to a Vite+ 0.3.3 workspace
(Pixi 8.21.0, TypeScript 7.0.2, Node 26.10.0, pnpm 12.5.1). New demo: the hero moves with the
keyboard (arrows, WASD / ZQSD), frame-rate independent, kept inside the window, blocked by a
wall (`Graphics` square below it, `Rectangle.intersects`). `vp run ready` green (check, 11 unit
tests, build, 2 e2e). Nothing in progress: `main` = origin (`72cd354`), GitHub CI green.

Not verified: `vp dev` on Windows without WSL.

## Later

- Vite+ 1.0.0 (rc.0 published 2026-09-22): bump `catalog:` when stable, re-run `vp run ready`.
- Deploy the demo (GitHub Pages workflow, `BASE=/seed-pixi-typescript/`) so the README can link a live version? Offered.
- Root `dev` script so `vp run dev` replaces `vp -C apps/game dev` in the README quickstart? Offered.
- 4 stale `origin/dependabot/*` branches (webpack era): delete on GitHub (outward-facing, ask first).
- GitHub repo description and topics still say webpack: update them on GitHub (ask first).
