# CSS Animations & Transitions

Reference file for animation patterns. See SKILL.md for core CSS patterns.

Each pattern below has an engine that does not follow. The versions are the first Chrome /
Firefox / Safari release with full support; "none" means not supported.

---

## Animate to Auto Height

`interpolate-size: allow-keywords` is Limited: 129 / none / none. Firefox and Safari drop the
declaration and the height snaps, which is an acceptable fallback. The property is inherited:
set it on the component, not on `html`, unless every transition on the page is yours.

```css
.accordion-content {
  interpolate-size: allow-keywords;
  height: 0;
  overflow: hidden;
  transition: height var(--duration-normal) var(--easing-default);
}

.accordion.is-open .accordion-content {
  height: auto;
}
```

### A native `<details>`

The content of a closed `<details>` is not rendered, so a rule on a child cannot animate the
closing. Target the `::details-content` pseudo-element (Newly: 131 / 143 / 18.4) and keep it
rendered during the transition with `content-visibility ... allow-discrete`:

```css
details::details-content {
  interpolate-size: allow-keywords;
  block-size: 0;
  overflow: clip;
  opacity: 0;
  transition:
    block-size var(--duration-normal),
    opacity var(--duration-normal),
    content-visibility var(--duration-normal) allow-discrete;
}

details[open]::details-content {
  block-size: auto;
  opacity: 1;
}
```

- Height: Chromium only. Opacity with a held close: Chromium and Safari 18+.
- Firefox fades the opening and closes at once: it does not transition `content-visibility`.

---

## `@starting-style` for Entry Animations

`@starting-style` is Newly: 117 / 129 / 17.5.

```css
/* Dialog/popover entry animation */
dialog {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity var(--duration-normal),
    transform var(--duration-normal),
    overlay var(--duration-normal) allow-discrete,
    display var(--duration-normal) allow-discrete;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* Exit animation */
dialog:not([open]) {
  opacity: 0;
  transform: translateY(-20px);
}
```

- The entry works in the three engines. The exit needs a transition of `display`, which is
  Limited (117 / none / 18): in Firefox the dialog disappears at once.
- `CSS.supports("transition-behavior", "allow-discrete")` is no test for that: Firefox parses
  the property and still does not transition `display`.
- `overlay` keeps a top-layer element above the page during the exit. Chromium only; ignored
  elsewhere.
- `::backdrop` needs its own transition and its own `@starting-style` rule.
- `@starting-style` also applies on the first render of the page. Never match an element that
  is in the served HTML: a hero that starts at `opacity: 0` delays the Largest Contentful
  Paint. Arm it on a state that does not exist at load (`[open]`, a class set by a script).

### A fade that also exits in Firefox

`visibility` transitions in every engine: it flips at the end of the duration, so the element
stays visible while `opacity` runs.

```css
.toast {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--duration-normal),
    visibility var(--duration-normal);
}

.toast.is-open {
  opacity: 1;
  visibility: visible;
}
```

---

## View Transitions

Same-document transitions (`document.startViewTransition`) are Newly: 111 / 144 / 18.
Cross-document transitions are Limited: 126 / none / 18.2, same origin only, and both pages
must opt in:

```css
@view-transition {
  navigation: auto;
}
```

```css
/* Custom transition names */
.card {
  view-transition-name: card;
}

/* Customize animation */
::view-transition-old(card) {
  animation: fade-out 200ms ease;
}

::view-transition-new(card) {
  animation: fade-in 200ms ease;
}
```

- The browser stylesheet sets `:root { view-transition-name: root; }`: every transition
  captures and cross-fades the whole page, and the page does not respond during it. For one
  component, that is the wrong tool: use a transition on the component.
- To move only the named elements, set `:root { view-transition-name: none; }` for the time
  of that transition, with a class.
- A `view-transition-name` must be unique on the page at capture time.
- The reduced-motion block below does not reach the `::view-transition-*` pseudo-elements:
  skip the call to `startViewTransition` under `prefers-reduced-motion: reduce`.

---

## Keyframe Animations

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slide-up 300ms ease-out;
}
```

---

## Transition Properties

```css
.button {
  transition:
    background-color var(--duration-fast) var(--easing-default),
    transform var(--duration-fast) var(--easing-default);
}

.button:hover {
  background-color: var(--color-primary-dark);
  transform: scale(1.02);
}

.button:active {
  transform: scale(0.98);
}
```

---

## Reduced Motion Support

```css
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
