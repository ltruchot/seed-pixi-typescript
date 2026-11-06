# Modern Reset

Josh W. Comeau's [CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/), adapted. The
reduced-motion block at the end is an addition.

```css
/* Box sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin; a modal <dialog> is centered by its own margin: auto */
*:not(dialog) {
  margin: 0;
}

/* Sensible body defaults */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased; /* non-standard, macOS only */
}

/* Media defaults */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/* Form elements inherit font */
input,
button,
textarea,
select {
  font: inherit;
}

/* Text wrapping */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

p {
  text-wrap: pretty; /* Avoid orphans; Firefox ignores it */
}

h1,
h2,
h3,
h4,
h5,
h6 {
  text-wrap: balance; /* Balance heading lines */
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Left out on purpose

- `interpolate-size: allow-keywords` on `html`. It is Chromium only, and it is inherited: every
  transition on the page that goes to or from `auto`, third-party CSS included, starts to
  animate. Set it on the component that needs it: `references/animations.md`.
- `scroll-behavior: smooth` on `html`. When wanted, put it under
  `@media (prefers-reduced-motion: no-preference)`.
