# Layout: grid, subgrid, container queries, logical properties

## Layout: Grid

```css
/* Basic grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
}

/* Named areas */
.layout {
  display: grid;
  grid-template-areas:
    'header header'
    'sidebar main'
    'footer footer';
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}
```

### Subgrid

```css
/* Parent grid */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

/* Child inherits parent grid lines */
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* Span 3 rows of parent */
}
```

## Container Queries

Respond to container size, not viewport.

```css
/* Define container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Query container */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}

@container card (max-width: 399px) {
  .card {
    display: block;
  }
}

/* Container query units */
.card-title {
  font-size: clamp(1rem, 5cqi, 1.5rem); /* cqi = container inline */
}
```

## Logical Properties

Write direction-agnostic CSS.

```css
/* Physical (avoid) */
margin-left: 1rem;
padding-top: 1rem;
border-right: 1px solid;

/* Logical (prefer) */
margin-inline-start: 1rem; /* Left in LTR, right in RTL */
padding-block-start: 1rem; /* Top in horizontal, left in vertical */
border-inline-end: 1px solid;

/* Shorthands */
margin-inline: 1rem; /* Left + right */
padding-block: 1rem 2rem; /* Top and bottom */
inset: 0; /* top, right, bottom, left */
```
