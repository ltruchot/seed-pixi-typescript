# Color: custom properties, light-dark(), OKLCH

## Custom Properties (CSS Variables)

### Organization Pattern

```css
:root {
  /* Colors (OKLCH) */
  --color-primary: oklch(55% 0.25 260);
  --color-primary-light: oklch(from var(--color-primary) calc(l + 0.2) c h);
  --color-primary-dark: oklch(from var(--color-primary) calc(l - 0.2) c h);

  /* Semantic colors */
  --color-text: oklch(20% 0 0);
  --color-bg: oklch(98% 0 0);
  --color-surface: oklch(100% 0 0);
  --color-border: oklch(80% 0 0);

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0% 0 0 / 0.1);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Dark Mode with `light-dark()`

Newly available: `light-dark()` needs Chrome 123, Firefox 120, Safari 17.5.

```css
:root {
  color-scheme: light dark;

  --color-text: light-dark(oklch(20% 0 0), oklch(95% 0 0));
  --color-bg: light-dark(oklch(98% 0 0), oklch(15% 0 0));
  --color-surface: light-dark(oklch(100% 0 0), oklch(20% 0 0));
  --color-border: light-dark(oklch(80% 0 0), oklch(30% 0 0));
}

/* Override for specific preference */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: oklch(70% 0.2 260); /* Lighter in dark mode */
  }
}
```

## OKLCH Colors

OKLCH = Lightness, Chroma, Hue. Perceptually uniform.

```css
/* Basic OKLCH */
color: oklch(50% 0.2 260); /* L: 0-100%, C: 0-0.4, H: 0-360 */

/* With alpha */
color: oklch(50% 0.2 260 / 0.8);

/* Relative color syntax (generate palettes): Newly, Chrome 125, Firefox 128, Safari 18 */
--base: oklch(55% 0.25 260);
--lighter: oklch(from var(--base) calc(l + 0.15) c h);
--darker: oklch(from var(--base) calc(l - 0.15) c h);
--muted: oklch(from var(--base) l calc(c * 0.5) h);
--complement: oklch(from var(--base) l c calc(h + 180));
```

### `color-mix()`

```css
/* Mix two colors */
background: color-mix(in oklch, var(--color-primary) 70%, white);

/* Hover states */
.button:hover {
  background: color-mix(in oklch, var(--color-primary), black 15%);
}

/* Transparency */
border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
```
