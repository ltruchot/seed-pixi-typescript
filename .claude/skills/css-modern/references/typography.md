# Typography and typed tokens

## Typography & typed tokens

`text-wrap` fixes ragged headings and orphans with zero JS:

```css
h1,
h2,
h3 {
  text-wrap: balance; /* even line lengths, use under ~6 lines */
}
p,
li {
  text-wrap: pretty; /* no orphan word on the last line; Firefox ignores it */
}
```

`@property` gives a token a type, so it animates and never falls back to a raw string:

```css
@property --pixi-ring-size {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}

.card {
  transition: --pixi-ring-size var(--pixi-transition-fast);
}
```

An untyped custom property flips from one value to the other; a typed one interpolates.
`@property` is Newly available (Firefox 128).
