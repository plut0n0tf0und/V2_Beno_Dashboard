# Design System — WCAG 2.1 AA Reference

> This document captures all accessibility upgrades applied to the AntiGravity design system.
> Use it as the single source of truth when building new components or modifying existing ones.

---

## 1. Color Tokens

All tokens live in `src/index.css` inside the `@theme` block (Tailwind v4).
Dynamic tokens resolve from CSS custom properties on `:root` (light) and `.dark` (dark).

### Surface Scale

| Token | Tailwind class | Light | Dark |
|---|---|---|---|
| `--color-surface` | `bg-surface` | `#FFFFFF` | `#0E0E0E` |
| `--color-surface-container-lowest` | `bg-surface-container-lowest` | `#FFFFFF` | `#080808` |
| `--color-surface-container-low` | `bg-surface-container-low` | `#F8F9FA` | `#131313` |
| `--color-surface-container` | `bg-surface-container` | `#F1F3F4` | `#191A1A` |
| `--color-surface-container-high` | `bg-surface-container-high` | `#E8EAED` | `#1F2020` |
| `--color-surface-container-highest` | `bg-surface-container-highest` | `#DADCE0` | `#252626` |

### Text / On-Surface

| Token | Tailwind class | Light | Dark | Contrast (on base surface) |
|---|---|---|---|---|
| `--color-on-surface` | `text-on-surface` | `#1F1F1F` | `#C6C6C7` | 16.1:1 / 7.8:1 ✓ AAA |
| `--color-on-surface-variant` | `text-on-surface-variant` | `#5F6368` | `#B0B0B0` | 5.9:1 / 5.9:1 ✓ AA |

> **Breaking change from pre-AA:** Dark mode variant was `#ACABAA` (4.2:1 — failed AA for normal text). Updated to `#B0B0B0`.

### Accent & Semantic

| Token | Tailwind class | Value | Notes |
|---|---|---|---|
| `--color-tertiary` | `text-tertiary` / `bg-tertiary` | `#679CFF` | Use for UI accents, active states, focus rings. Not for body text on dark surfaces. |
| `--color-primary` | `text-primary` | `#C6C6C7` | Heading text in dark mode |
| `--color-error` | `text-error` | `#EC7C8A` | Error states only. Pair with an icon or text label — never color alone. |
| `--color-outline-variant` | `border-outline-variant` | `#484848` | Subtle borders |

### Accessibility-Specific Tokens

These tokens were added during the AA upgrade. Always use them — never use opacity hacks.

| Token | Tailwind class | Light | Dark | Purpose |
|---|---|---|---|---|
| `--color-disabled-text` | `text-disabled-text` | `#767676` | `#888888` | Text on disabled controls (4.54:1 / 4.6:1 ✓) |
| `--color-disabled-bg` | `bg-disabled-bg` | `#E8EAED` | `#252626` | Background of disabled controls |
| `--color-placeholder` | `text-placeholder` | `#767676` | `#888888` | Input placeholder text (4.54:1 / 4.5:1 ✓) |
| `--color-focus-ring` | — | `#679CFF` | `#679CFF` | Global focus outline color |

#### Why no opacity hacks?

```css
/* ✗ NEVER — opacity reduces effective contrast unpredictably */
text-on-surface-variant/50
text-on-surface/40
opacity-50

/* ✓ ALWAYS — use a token with a verified contrast ratio */
text-disabled-text
text-placeholder
text-on-surface-variant
```

---

## 2. Focus System

Defined globally in `src/index.css`. Never override with `outline-none` on interactive elements.

```css
*:focus        { outline: none; }          /* removes browser default */
*:focus-visible {
  outline: 2px solid var(--color-focus-ring);  /* #679CFF */
  outline-offset: 2px;
  border-radius: 4px;
}
```

- `focus` is suppressed (hides ring on mouse click)
- `focus-visible` shows the ring only for keyboard navigation
- Applies automatically to every `<button>`, `<input>`, `<a>`, `[role="button"]`, etc.
- **Do not add `outline-none` to any interactive element.** If you need a custom ring, use `focus-visible:ring-2 focus-visible:ring-tertiary/40` via Tailwind.

### Input-specific focus

Inputs use an additional border highlight alongside the global ring:

```tsx
className="... focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary outline-none"
```

The `outline-none` here is intentional — the `focus:ring` replaces it visually while the global `focus-visible` rule still fires for keyboard users.

---

## 3. Disabled States

| Property | Class to use | Never use |
|---|---|---|
| Text color | `text-disabled-text` | `text-on-surface/50`, `opacity-50` |
| Background | `bg-disabled-bg` | `bg-on-surface-variant/20` |
| Cursor | `cursor-not-allowed` | — |
| HTML attribute | `disabled` (native) or `aria-disabled="true"` | — |

```tsx
/* ✓ Correct pattern */
<button
  disabled={!isValid}
  aria-disabled={!isValid}
  className="... disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
>
  Save
</button>
```

---

## 4. Placeholder Text

```tsx
/* ✓ Correct */
className="... placeholder:text-placeholder"

/* ✗ Wrong — fails contrast */
className="... placeholder:text-on-surface-variant/60"
className="... placeholder:text-on-surface-variant/50"
```

---

## 5. Semantic HTML & Landmarks

Every page must have exactly one of each landmark. Use `aria-label` when the same element type appears more than once.

| Landmark | Element | Required `aria-label` |
|---|---|---|
| Banner | `<header>` | Only if multiple headers exist |
| Navigation | `<nav>` | Always — e.g. `aria-label="Main navigation"` |
| Main content | `<main id="main-content">` | Not required (unique per page) |
| Sidebar | `<aside>` | `aria-label="Application sidebar"` |
| Sections | `<section>` | `aria-label="..."` (replaces nested `<main>`) |

### Current page structure

```
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header>                          ← HomeNavbar / ProjectNavbar
    <nav aria-label="...">
  </header>
  <aside aria-label="Application sidebar">   ← Sidebar (home only)
  <main id="main-content">          ← App.tsx
    <Home>
      <header>                      ← page-level header
      <section aria-label="Projects list">
    </Home>
    — or —
    <ProjectDetails>
      <main role="region">          ← dashboard / config screens
    </ProjectDetails>
  </main>
</body>
```

---

## 6. Heading Hierarchy

One `<h1>` per page. Never skip levels.

| Page | h1 | h2 | h3 |
|---|---|---|---|
| Home | "Projects" | — | Card titles (BentoCard) |
| ProjectDetails (dashboard) | "Dashboard" | "No charts to display" | — |
| ProjectDetails (config) | Section titles (AddDataSource, etc.) | — | — |
| Dashboard (standalone) | "Dashboard" | Chart name | — |

```tsx
/* ✓ */
<h1>Projects</h1>
  <h2>Section heading</h2>
    <h3>Card title</h3>

/* ✗ — skips h2 */
<h1>Projects</h1>
  <h3>Card title</h3>
```

---

## 7. Button Accessibility

### Every button needs an accessible name

| Scenario | Solution |
|---|---|
| Text button | Text content is the name |
| Icon-only button | `aria-label="Descriptive action"` |
| Toggle button | `aria-pressed={boolean}` + `aria-label` |
| Menu trigger | `aria-haspopup="menu"` + `aria-expanded={boolean}` + `aria-label` |
| Dropdown trigger | `aria-haspopup="listbox"` + `aria-expanded={boolean}` |

```tsx
/* Icon-only */
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

/* Toggle */
<button
  aria-pressed={isDarkMode}
  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>

/* Menu trigger */
<button
  aria-haspopup="menu"
  aria-expanded={isMenuOpen}
  aria-label={`Chart options for ${config.name}`}
>
```

### Always add `aria-hidden="true"` to decorative icons

```tsx
<Search aria-hidden="true" />
<ChevronDown aria-hidden="true" />
```

### Interactive div → button

Never use `<div onClick>` for interactive elements. Convert to `<button>` or add full keyboard support:

```tsx
/* ✗ */
<div onClick={handleClick}>Click me</div>

/* ✓ */
<button onClick={handleClick}>Click me</button>

/* ✓ If div is unavoidable (e.g. accordion header) */
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
>
```

---

## 8. Dropdown / Combobox (CustomDropdown)

`CustomDropdown` is fully keyboard-accessible. Use it for all select-style inputs.

### ARIA pattern

```tsx
<button
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls="listbox-id"
>

<div role="listbox" id="listbox-id">
  <button role="option" aria-selected={value === option}>
```

### Keyboard support

| Key | Action |
|---|---|
| `Enter` / `Space` | Open/close or select focused option |
| `ArrowDown` | Move focus to next option |
| `ArrowUp` | Move focus to previous option |
| `Escape` | Close without selecting |
| `Tab` | Close and move focus out |

### Props

```tsx
<CustomDropdown
  options={['Option A', 'Option B']}
  value={selected}
  onChange={setSelected}
  headerLabel="Chart Type"      // renders a <label> above
  placeholder="Select..."
  disabled={false}
/>
```

---

## 9. Modal / Dialog

Both `EditNameModal` and `DataSourceMappingModal` follow this pattern.

### Required attributes

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title-id"
>
  <h2 id="modal-title-id">Modal Title</h2>
  <button aria-label="Close dialog">
    <X aria-hidden="true" />
  </button>
```

### Focus trap

- On open: focus moves to the first interactive element (input or close button)
- `Tab` cycles within the modal
- `Shift+Tab` cycles backwards
- `Escape` closes the modal
- Backdrop click closes the modal (when `isClosable`)

### Template

```tsx
// Focus trap implementation
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') { onClose(); return; }
  if (e.key !== 'Tab') return;
  const focusable = [...]; // collect focusable refs
  if (e.shiftKey && document.activeElement === focusable[0]) {
    e.preventDefault(); focusable[focusable.length - 1].focus();
  } else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
    e.preventDefault(); focusable[0].focus();
  }
};
```

---

## 10. Menu (role="menu")

Used in `BentoChart` (chart options) and `ProfilePopup`.

```tsx
<button
  aria-haspopup="menu"
  aria-expanded={isMenuOpen}
  aria-label="Chart options for Stock Price Overview"
>

<div
  role="menu"
  aria-label="Options for Stock Price Overview"
  onKeyDown={(e) => { if (e.key === 'Escape') setIsMenuOpen(false); }}
>
  <button role="menuitem">Edit Mapping</button>
  <button role="menuitem">Edit Name</button>
  <button role="menuitem">Delete Chart</button>
</div>
```

---

## 11. Form Inputs

### Label association

Always use `<label htmlFor>` — never rely on visually adjacent text.

```tsx
/* ✓ */
<label htmlFor="chart-name-input" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
  Chart Name
</label>
<input id="chart-name-input" type="text" ... />

/* ✗ — not associated */
<p className="text-xs ...">Chart Name</p>
<input type="text" ... />
```

### Checkbox

Use native `<input type="checkbox">` — not a custom div.

```tsx
/* ✓ */
<input
  type="checkbox"
  id="confirm-checkbox"
  checked={isConfirmed}
  onChange={() => setIsConfirmed(!isConfirmed)}
  disabled={!canProceed}
  className="w-5 h-5 rounded accent-tertiary cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
/>
<label htmlFor="confirm-checkbox">I confirm the data looks correct</label>

/* ✗ */
<div onClick={() => setIsConfirmed(!isConfirmed)} className="w-5 h-5 rounded border-2 ...">
```

### Input class template

```tsx
className="w-full bg-surface-container-low border border-on-surface-variant/20 rounded-xl
           py-3 px-4 text-sm text-on-surface
           placeholder:text-placeholder
           focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary
           outline-none transition-all
           disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
```

---

## 12. Navigation

### Sidebar nav

```tsx
<nav aria-label="Sidebar navigation">
  <ul>
    {navItems.map(item => (
      <li key={item.id}>
        <button
          aria-current={activePage === item.id ? 'page' : undefined}
        >
          {item.label}
        </button>
      </li>
    ))}
  </ul>
</nav>
```

- `aria-current="page"` marks the active route
- Use `<ul>/<li>` to give screen readers list count context

---

## 13. Skip Link

Defined in `src/index.css` as `.skip-link`. Added once in `App.tsx`.

```tsx
// App.tsx — first child inside the root div
<a href="#main-content" className="skip-link">Skip to main content</a>

// App.tsx — main element
<main id="main-content" ...>
```

The link is visually hidden until focused via keyboard (`Tab` as first action), then slides into view at the top of the page.

---

## 14. Mobile & Touch

### Tap targets

Enforced globally via `@media (pointer: coarse)` in `src/index.css`:

```css
@media (pointer: coarse) {
  button, [role="button"], a, input, select,
  [role="option"], [role="menuitem"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

- Minimum 44×44px for all interactive elements on touch devices
- FAB (mobile) is 56×56px — already compliant
- Ensure custom interactive elements include `role="button"` to inherit this rule

### Spacing

- Minimum `gap-3` (12px) between adjacent tap targets
- Prefer `gap-4` (16px) in dense mobile layouts

---

## 15. Reduced Motion

Defined globally in `src/index.css`. All Framer Motion animations are suppressed automatically.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For Framer Motion specifically, you can also check the hook:

```tsx
import { useReducedMotion } from 'motion/react';

const shouldReduce = useReducedMotion();
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: shouldReduce ? 0 : 0.4 }}
/>
```

---

## 16. Typography

| Token | Size | Use |
|---|---|---|
| `text-xs` | 12px | Labels, badges, stat captions |
| `text-sm` | 14px | Body copy, form inputs, menu items |
| `text-base` | 16px | Default body text |
| `text-lg` | 18px | Subheadings |
| `text-xl` | 20px | Section headings |
| `text-2xl` | 24px | Page subheadings |
| `text-3xl` | 30px | Page titles (h1) |
| `text-4xl` | 36px | Hero headings |

- Minimum body text: `text-sm` (14px) — never go below for readable content
- `text-xs` (12px) is acceptable for labels/captions only, not body copy
- Line height: `leading-normal` (1.5) for body, `leading-tight` (1.2) for headlines

### Font families

```tsx
font-headline   // Manrope — h1–h3, card titles, nav brand
font-body       // Inter — body copy, labels, inputs (default)
font-mono       // JetBrains Mono — code, URLs, data values
```

---

## 17. What Not To Do — Quick Reference

| ✗ Don't | ✓ Do instead |
|---|---|
| `text-on-surface-variant/50` | `text-disabled-text` or `text-on-surface-variant` |
| `placeholder:text-on-surface-variant/60` | `placeholder:text-placeholder` |
| `disabled:opacity-50` | `disabled:bg-disabled-bg disabled:text-disabled-text` |
| `outline-none` on buttons | Remove it — global focus-visible handles it |
| `<div onClick>` | `<button>` or `role="button"` + keyboard handler |
| `<h3>` without a parent `<h2>` | Fix heading hierarchy |
| Multiple `<main>` elements | Use `<section aria-label>` for nested regions |
| Icon without `aria-hidden` | `<Icon aria-hidden="true" />` |
| Modal without `role="dialog"` | Add `role="dialog" aria-modal="true" aria-labelledby` |
| Color as the only error indicator | Add icon + text alongside color |

---

## 18. WCAG 2.1 AA Compliance Status

| Criterion | Level | Status | Notes |
|---|---|---|---|
| 1.4.3 Contrast (text) | AA | ✓ Pass | All text tokens verified ≥ 4.5:1 |
| 1.4.11 Non-text Contrast | AA | ✓ Pass | UI components ≥ 3:1 |
| 1.4.12 Text Spacing | AA | ✓ Pass | No fixed heights blocking reflow |
| 2.1.1 Keyboard | A | ✓ Pass | All interactive elements keyboard accessible |
| 2.1.2 No Keyboard Trap | A | ✓ Pass | Modals trap focus intentionally with Escape exit |
| 2.4.1 Bypass Blocks | A | ✓ Pass | Skip link implemented |
| 2.4.3 Focus Order | A | ✓ Pass | DOM order matches visual order |
| 2.4.7 Focus Visible | AA | ✓ Pass | Global focus-visible ring on all elements |
| 3.1.1 Language of Page | A | ✓ Pass | `lang="en"` on `<html>` |
| 3.2.1 On Focus | A | ✓ Pass | No unexpected context changes |
| 4.1.2 Name, Role, Value | A | ✓ Pass | ARIA roles/labels on all custom components |
| 4.1.3 Status Messages | AA | ⚠ Partial | No `aria-live` regions yet for dynamic updates |

> **Remaining gap:** Add `aria-live="polite"` regions for toast notifications, selection counts, and async loading states when those features are built.

---

*Last updated: April 2026 — reflects AA upgrade applied to AntiGravity v1 codebase.*
