# Selectors and the cascade: :has(), nesting, @layer

## `:has()` Selector (Parent Selector)

```css
/* Style parent based on child; :user-invalid waits for the user, :invalid does not */
.form-group:has(input:user-invalid) {
  border-color: var(--color-error);
}

/* Card with image gets different layout */
.card:has(> img) {
  grid-template-rows: 200px 1fr;
}

/* Sibling selector */
label:has(+ input:required)::after {
  content: ' *';
  color: var(--color-error);
}

/* Empty state */
.list:has(> :not([hidden])) {
  display: grid;
}
.list:not(:has(> :not([hidden]))) {
  display: none;
}
```

## Native Nesting

```css
/* Basic nesting */
.card {
  background: var(--color-surface);

  & .title {
    font-size: var(--text-lg);
  }

  & .content {
    padding: var(--space-md);
  }

  /* Pseudo-classes */
  &:hover {
    box-shadow: var(--shadow-md);
  }

  /* Pseudo-elements */
  &::before {
    content: '';
  }

  /* Media queries */
  @media (width >= 768px) {
    display: grid;
  }
}

/* Compound selector (no space = &) */
.button {
  &.primary {
    /* .button.primary */
    background: var(--color-primary);
  }

  &[disabled] {
    /* .button[disabled] */
    opacity: 0.5;
  }
}
```

**Nesting limits:**

- Max 2-3 levels deep
- No BEM-style suffix (`&-modifier` doesn't work like SCSS)
- `@keyframes`, `@font-face` cannot be nested

## Cascade Layers

Control specificity order.

```css
/* Define layer order (first = lowest priority) */
@layer reset, base, components, utilities;

@layer reset {
  *:not(dialog) {
    margin: 0;
  }
}

@layer base {
  body {
    font-family: var(--font-sans);
  }
}

@layer components {
  .button {
    /* component styles */
  }
}

@layer utilities {
  .hidden {
    display: none !important;
  }
}
```
