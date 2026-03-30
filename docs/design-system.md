# OmniCalc — Design System

> **Codename:** Editorial Precision
> **Philosophy:** Glassmorphism meets mathematical rigor.
> Intentional asymmetry, tonal layering, and typographic precision
> replace traditional box-and-line UI patterns.

---

## Brand Colors

### Primary Palette

| Token         | Hex       | Usage                                               |
| ------------- | --------- | --------------------------------------------------- |
| `primary-500` | `#4648D4` | Electric Violet — CTA buttons, active states, links |
| `primary-400` | `#6366F1` | Lighter variant — hover states                      |
| `primary-600` | `#3730A3` | Darker variant — pressed states                     |
| `primary-50`  | `#EEF2FF` | Tinted backgrounds                                  |

### Secondary Palette

| Token           | Hex       | Usage                                |
| --------------- | --------- | ------------------------------------ |
| `secondary-500` | `#505F76` | Muted Slate — secondary text, labels |
| `secondary-400` | `#64748B` | Lighter — placeholder text           |
| `secondary-600` | `#3B4A5E` | Darker — subtle emphasis             |

### Tertiary Palette

| Token          | Hex       | Usage                                 |
| -------------- | --------- | ------------------------------------- |
| `tertiary-500` | `#006C49` | Deep Green — success, positive values |
| `tertiary-400` | `#10B981` | Lighter — success badges              |

### Semantic Colors

| Token                    | Light Mode | Dark Mode | Usage                         |
| ------------------------ | ---------- | --------- | ----------------------------- |
| `surface`                | `#FFFFFF`  | `#0A0A0F` | Page background               |
| `surface-container`      | `#F5F5FA`  | `#141420` | Card/panel background         |
| `surface-container-low`  | `#FAFAFA`  | `#1A1A2E` | Subtle elevation              |
| `surface-container-high` | `#EDEDF3`  | `#1E1E32` | Elevated elements             |
| `on-surface`             | `#1A1A2A`  | `#E8E8F0` | Primary text                  |
| `on-surface-variant`     | `#505F76`  | `#A0A0B8` | Secondary text                |
| `error`                  | `#DC2626`  | `#F87171` | Error states, negative values |
| `outline`                | `#D4D4E0`  | `#2E2E42` | Subtle borders (sparingly)    |

---

## Typography

### Font Stack

| Context                 | Font           | Weight        | Fallback              |
| ----------------------- | -------------- | ------------- | --------------------- |
| Headings                | Manrope        | 700 (Bold)    | system-ui, sans-serif |
| Display (calculator)    | Manrope        | 300 (Light)   | system-ui, sans-serif |
| Body / UI               | Inter          | 400, 500, 600 | system-ui, sans-serif |
| Monospace (expressions) | JetBrains Mono | 400           | monospace             |

### Scale

| Token             | Size            | Line Height | Usage                 |
| ----------------- | --------------- | ----------- | --------------------- |
| `text-display-xl` | 48px / 3rem     | 1.1         | Calculator result     |
| `text-display-lg` | 36px / 2.25rem  | 1.2         | Calculator expression |
| `text-heading-lg` | 24px / 1.5rem   | 1.3         | Section headings      |
| `text-heading-md` | 20px / 1.25rem  | 1.4         | Subsection headings   |
| `text-body-lg`    | 16px / 1rem     | 1.5         | Body text             |
| `text-body-md`    | 14px / 0.875rem | 1.5         | Secondary body        |
| `text-label`      | 12px / 0.75rem  | 1.4         | Labels, hints         |
| `text-button`     | 14px / 0.875rem | 1.0         | Button text           |

---

## Spacing

Based on an 4px grid. All spacing values must use these tokens.

| Token      | Value |
| ---------- | ----- |
| `space-1`  | 4px   |
| `space-2`  | 8px   |
| `space-3`  | 12px  |
| `space-4`  | 16px  |
| `space-5`  | 20px  |
| `space-6`  | 24px  |
| `space-8`  | 32px  |
| `space-10` | 40px  |
| `space-12` | 48px  |
| `space-16` | 64px  |

---

## Corner Radius

| Token             | Value  | Usage                     |
| ----------------- | ------ | ------------------------- |
| `rounded-sm`      | 8px    | Small elements, chips     |
| `rounded-DEFAULT` | 16px   | Cards, panels             |
| `rounded-md`      | 24px   | Dialogs, large cards      |
| `rounded-lg`      | 32px   | Feature sections          |
| `rounded-full`    | 9999px | Circular buttons, avatars |

---

## Glassmorphism

The signature visual effect. Use sparingly for elevated elements.

```css
/* Glass panel */
.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
}

/* Dark mode glass */
.glass-panel-dark {
  background: rgba(10, 10, 15, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

### Rules

- Glass borders use **opacity** (rgba), never solid colors
- Maximum 2 glass layers stacked (avoid blur stacking performance hit)
- Always test on low-end devices for performance

---

## Shadows & Elevation

| Token       | CSS                            | Usage             |
| ----------- | ------------------------------ | ----------------- |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)`   | Subtle lift       |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)`  | Cards             |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)`  | Modals, dropdowns |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.16)` | Floating panels   |

In dark mode, shadows are less visible. Rely on border opacity and
surface color differentiation instead.

---

## Design Rules

### The "No-Line" Rule

> **Never** use 1px solid borders to separate sections.
> Instead, use tonal surface color differences to create visual hierarchy.

```
❌  border-bottom: 1px solid #e5e7eb;
✅  Use surface-container vs surface background difference
```

### Intentional Asymmetry

- Padding is **not** always equal. Use asymmetric padding for visual interest.
- Example: `padding: 24px 32px 24px 24px` — extra right padding for breathing room.

### Tonal Layering

- Background surfaces use subtle color shifts to imply depth:
  - `surface` → `surface-container-low` → `surface-container` → `surface-container-high`
- Each layer is approximately 3-5% darker (or lighter in dark mode)

### Micro-Animations

- All interactive elements should have subtle transitions
- Duration: 150ms for micro (hover), 250ms for state changes, 400ms for layout shifts
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard)
- Scale on press: `transform: scale(0.97)` for buttons

---

## NativeWind Token Mapping

These tokens map to `tailwind.config.js` extensions:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          400: '#6366F1',
          500: '#4648D4',
          600: '#3730A3',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          container: 'var(--surface-container)',
          'container-low': 'var(--surface-container-low)',
          'container-high': 'var(--surface-container-high)',
        },
        'on-surface': {
          DEFAULT: 'var(--on-surface)',
          variant: 'var(--on-surface-variant)',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '0.5rem',
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
    },
  },
};
```

---

_Document version: 0.1.0_
