# Design System Specification: Editorial Precision & Tactile Depth

## 1. Overview & Creative North Star: "The Digital Architect"

This design system moves beyond the generic utility of standard SaaS platforms to embrace a philosophy of **Editorial Precision**. The North Star for this system is **"The Digital Architect"**—a vision where every interface feels like a high-end, custom-built workspace.

We reject the "boxed-in" nature of traditional grids. Instead, we use intentional asymmetry, expansive breathing room (whitespace), and a sophisticated layering of translucent surfaces. By blending the structured logic of Material Design 3 with the ethereal aesthetics of modern minimalism, we create an environment that feels premium, authoritative, and intentionally curated.

---

## 2. Colors & Tonal Architecture

The palette is built on a foundation of "Deep Indigo" and "Zinc," designed to feel expensive and calm.

### Core Palette

- **Primary (`#4648D4`):** The signature "Electric Violet." Use this for core actions and brand moments.
- **Secondary (`#505F76`):** A muted Slate for utilitarian elements.
- **Tertiary (`#006C49`):** A sophisticated Emerald reserved for "Pro" features and success states.
- **Surface & Background (`#F7F9FB`):** A clean, cool-toned base that provides a gallery-like backdrop.

### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established exclusively through:

1.  **Background Shifts:** Placing a `surface-container-low` component against a `surface` background.
2.  **Shadow Depth:** Using elevation to imply separation.
3.  **Negative Space:** Utilizing the Spacing Scale (8, 10, 12) to create "voids" that act as natural dividers.

### Surface Hierarchy & Glassmorphism

Treat the UI as a physical stack of materials.

- **The Base:** `surface` (`#F7F9FB`).
- **The Inset:** `surface-container-low` for secondary content areas.
- **The Floating Layer:** Use `surface-container-lowest` (#FFFFFF) with a `backdrop-filter: blur(20px)` at 80% opacity to create the "Glass" effect. This allows the primary brand colors to bleed through subtly, grounding the element in the environment.

---

## 3. Typography: Editorial Authority

We utilize a dual-font system to balance character with high-performance legibility.

- **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` and `headline-md` with tighter letter-spacing (-0.02em) to create a "Senior Portfolio" editorial feel.
- **Body & UI (Inter):** The workhorse. Inter provides maximum legibility for complex data.
- **Hierarchy Tip:** Use `label-md` in all-caps with increased letter-spacing (+0.05em) for category headers to provide a structural, "architectural" anchor to pages.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are replaced with **Ambient Glows** and **Tonal Stacking**.

### The Layering Principle

Instead of a shadow, place a `surface-container-highest` card inside a `surface-container-low` section. This "recessed" look creates depth without visual clutter.

### Ambient Shadows

When an element must float (e.g., a Modal or Primary Dropdown), use a multi-layered shadow:

- **Shadow Token:** `0 20px 40px rgba(70, 72, 212, 0.05)` (A violet-tinted shadow).
- **Opacity:** Never exceed 8%. The goal is a "ghost" of a shadow that mimics natural soft-box studio lighting.

### The "Ghost Border" Fallback

If contrast is required for accessibility, use a **Ghost Border**: `outline-variant` at 15% opacity. It should be felt, not seen.

---

## 5. Component Logic

### Buttons: Tactile High-Quality

- **Primary:** `primary` background with a subtle gradient transition to `primary-container`.
- **Shape:** `DEFAULT` (1rem/16px) or `md` (1.5rem/24px) corner radius.
- **Interaction:** On hover, increase the `surface-tint` to create a "glowing" effect rather than just darkening the color.

### Cards & Containers

- **Forbid Dividers:** Do not use lines to separate header from body. Use a `1.5rem` (spacing-6) gap.
- **Layout:** Use `surface-container-lowest` for card backgrounds to pop against the `surface` background.

### Input Fields

- **Styling:** Use a "filled" style with `surface-container-high` and no border.
- **Focus:** Transition the background to `surface-container-lowest` and add a 2px `primary` "Ghost Border" at 30% opacity.

### Chips & Tags

- **Pro Features:** Use `tertiary-container` with `on-tertiary-fixed-variant` text.
- **Shape:** Always `full` (9999px) to contrast against the softer `1rem` radius of cards.

### Interactive "Glass" Tooltips

- Tooltips must use the glassmorphism rule: Semi-transparent `inverse-surface` with a heavy blur. This prevents the tooltip from feeling like a heavy "block" on the screen.

---

## 6. Do’s and Don’ts

### Do:

- **Use Intentional Asymmetry:** Align a large `display-md` headline to the left while keeping action buttons floating to the far right.
- **Embrace White Space:** If you think there is enough space, add 1rem more. The spacing scale (16, 20, 24) is your best friend.
- **Tint your Neutrals:** Ensure your "Zinc" and "Slate" shades have a hint of the Primary Indigo to maintain a cohesive "temperature."

### Don’t:

- **Don't use 100% Black:** Use `on-surface` (`#191C1E`) for text. Pure black breaks the soft minimalism.
- **Don't use Default Grids:** Avoid the "3-column card row" cliché. Try overlapping cards or varying card widths (e.g., a 60/40 split) to create visual interest.
- **Don't use Hard Edges:** Unless it's a specific data-viz element, every container must have at least a `sm` (0.5rem) radius.
