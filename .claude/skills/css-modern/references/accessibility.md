# Accessibility and scrolling

## Scroll Behavior

```css
/* Smooth scroll, only for users who accept motion */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* Scroll snap */
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
}

.carousel-item {
  scroll-snap-align: center;
}

/* Scroll margin (anchor offset) */
[id] {
  scroll-margin-top: 80px; /* Account for fixed header */
}
```

## Accessibility

```css
/* Focus visible for keyboard only */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
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

/* Forced colors (Windows High Contrast) */
@media (forced-colors: active) {
  .button {
    border: 2px solid currentColor;
  }
}

/* Target size: 24x24 is WCAG 2.2 SC 2.5.8 (AA), 44x44 is SC 2.5.5 (AAA).
   A link inside a sentence is exempt, and min-* does nothing on an inline box. */
button,
.button {
  min-inline-size: 24px;
  min-block-size: 24px;
}
@media (pointer: coarse) {
  button,
  .button {
    min-inline-size: 44px;
    min-block-size: 44px;
  }
}
```
