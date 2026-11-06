---
name: css-modern
description: Modern CSS for evergreen browsers, each feature with its Baseline status - design tokens, layout (flex, grid, container queries), colors and dark mode, spacing, typography, :has(), nesting, cascade layers, transitions and animations. Use it whenever styling comes up, even when nobody says CSS - a misaligned or overflowing element, a color, a font, spacing, a hover or focus state, responsive or mobile layout, z-index, a dark mode, a stylesheet or a style block in .vue, .svelte or .html, or a question about whether a CSS feature is safe to use.
---

# Modern CSS Patterns

Target: the current Chromium, Firefox and Safari. Each feature carries its
[Baseline](https://web.dev/baseline) status, in the [summary table](#summary-table):

- **Widely**: in all three engines for 30 months. Use freely.
- **Newly**: in all three engines, recently. Use it; an older browser gets the fallback.
- **Limited**: missing in at least one engine. Progressive enhancement only: the page must
  work without it.

Statuses move. Check a feature not listed here on its MDN page before relying on it.

## Design tokens (read first for any `*.css`)

The project's tokens are in `apps/game/src/tokens.css`, named `--pixi-*`. When a token holds the value, the token is mandatory: no raw hex, no magic px, no ad-hoc rem. The project's tokens outrank every example in this skill.

**See `references/design-tokens.md`** for the priority rule, the usual namespaces, the no-indirection rule, how to add a token, and what to do when a linter guards them.

## Modern Reset

Josh W. Comeau's CSS Reset, adapted. **See `references/reset.md`** for the full stylesheet to copy.

## Transitions & Animations

**See `references/animations.md`** before animating a height to `auto`, a `<details>`, a dialog
entry or exit, or a view transition: each has an engine that does not follow, and the file
names the portable form.

## Utility Patterns

Visually hidden, truncation, full bleed, safe areas. **See `references/utilities.md`**.

## References: read the one the task needs

| Task | File |
|---|---|
| Custom properties, dark mode with `light-dark()`, OKLCH, `color-mix()`, palettes | [references/color.md](references/color.md) |
| Grid, subgrid, container queries, logical properties | [references/layout.md](references/layout.md) |
| `:has()`, native nesting, cascade layers, specificity | [references/selectors.md](references/selectors.md) |
| Fluid type, `text-wrap`, `@property` typed tokens | [references/typography.md](references/typography.md) |
| Focus, reduced motion, contrast, scroll behavior | [references/accessibility.md](references/accessibility.md) |
| Height to `auto`, `<details>`, dialog entry and exit, view transitions | [references/animations.md](references/animations.md) |
| A reset stylesheet to copy | [references/reset.md](references/reset.md) |
| Visually hidden, truncation, full bleed, safe areas | [references/utilities.md](references/utilities.md) |
| Token priority, namespaces, adding a token | [references/design-tokens.md](references/design-tokens.md) |

## Summary Table

Versions are the first Chrome / Firefox / Safari release with full support.

| Feature | Use | Baseline |
| --- | --- | --- |
| `@layer` | Specificity control | Widely |
| Container size queries, `cqi` | Component-based responsive | Widely |
| `oklch()`, `color-mix()` | Colors | Widely |
| Subgrid | Nested grids | Widely |
| Native nesting | Cleaner CSS | Widely |
| `:has()` | Parent selector | Widely |
| `:user-invalid`, `:user-valid` | Form state after input | Widely |
| `:is()`, `:where()`, `dvh`/`svh`/`lvh`, `aspect-ratio`, `inert`, `linear()` | | Widely |
| `light-dark()` | Theme colors | Newly, 123 / 120 / 17.5 |
| `text-wrap: balance` | Headings | Newly, 114 / 121 / 17.5 |
| `@property` | Typed tokens | Newly, 85 / 128 / 16.4 |
| Relative color (`oklch(from ...)`) | Palettes | Newly, 125 / 128 / 18 |
| `@starting-style` | Entry animations | Newly, 117 / 129 / 17.5 |
| `::details-content` | Animating `<details>` | Newly, 131 / 143 / 18.4 |
| View transitions, same document | State changes | Newly, 111 / 144 / 18 |
| Popover, `@scope`, `field-sizing`, style queries | | Newly |
| `text-wrap: pretty` | Paragraphs | Limited: no Firefox |
| Transition of `display` | Exit animations | Limited: no Firefox |
| `interpolate-size`, `calc-size()` | Animate to `auto` | Limited: Chromium only |
| View transitions, cross-document | Page navigation | Limited: no Firefox |
| Scroll-driven animations, anchor positioning | | Limited |

## Source

- [web.dev - Baseline](https://web.dev/baseline)
- [web-features explorer](https://web-platform-dx.github.io/web-features-explorer/): the status of one feature
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Josh W. Comeau - A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
