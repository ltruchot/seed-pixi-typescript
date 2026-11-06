# Utility Patterns

```css
/* Visually hidden, still read by a screen reader */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%); /* clip is deprecated */
  white-space: nowrap;
  border: 0;
}

/* One-line truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Contain floats: replaces the clearfix hack */
.flow-root {
  display: flow-root;
}

/* Full bleed in a constrained container.
   100vw includes a classic scrollbar: the page needs overflow-x: clip, or use a grid
   with a full-width column instead. */
.full-bleed {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
}

/* Safe areas (notch, home indicator); needs viewport-fit=cover in the viewport meta */
.safe-area {
  padding-inline: max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right));
  padding-block-end: max(1rem, env(safe-area-inset-bottom));
}
```
