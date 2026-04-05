# Design System Specification

## 1. Overview & Creative North Star: "The Ethereal Logic"

This design system is built to transform a high-utility tool into a premium, editorial digital experience. Moving beyond the standard "utility app" aesthetic, we embrace a Creative North Star dubbed **"The Ethereal Logic."**

The system balances the mathematical precision of a calculator with a soft, atmospheric UI. We achieve this through "Atmospheric Layering"—where components don't just sit on a page, but float within a space defined by light and depth. By utilizing high-contrast typography scales (Manrope for expression, Inter for function) and intentional asymmetry in button weighting, we move away from generic grids toward a signature SaaS identity that feels both professional and avant-garde.

---

## 2. Colors: Tonal Depth & The No-Line Rule

Our palette is anchored in deep indigos and expansive whites, designed to feel sophisticated and "expensive."

### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Structural boundaries must be defined solely through background color shifts. For example, a `surface_container_low` calculator history panel should sit on a `surface` background without a stroke.

### Surface Hierarchy & Nesting

Instead of a flat grid, treat the UI as stacked sheets of fine paper or frosted glass.

- **Surface (Base):** The foundation of the application.
- **Surface Container (Nesting):** Use `surface_container_lowest` to `surface_container_highest` to create logical groupings. An input field might use `surface_container_highest` to appear "recessed" into a `surface_container` card.

### The "Glass & Gradient" Rule

To add visual "soul," use Glassmorphism for floating elements (like toast notifications or overflow menus). Use semi-transparent surface colors with a `backdrop-blur` of 12px–20px.

- **Signature CTA Texture:** Use a subtle linear gradient (Top-Left to Bottom-Right) transitioning from `primary` (#392cc1) to `primary_container` (#534ad9). This provides a tactile, "lit-from-within" glow.

---

## 3. Typography: The Editorial Balance

We utilize a dual-typeface system to distinguish between the "Human" brand and the "Mathematical" utility.

- **Display & Headlines (Manrope):** Our expressive voice. Use `display-lg` for large result totals. The wide apertures of Manrope convey a modern, open feel.
- **Body & Labels (Inter):** Our functional voice. Inter's tall x-height ensures maximum legibility for complex calculations and small labels in the history tape.

**Hierarchy as Identity:**
By pairing a massive `display-md` result with a tiny, high-contrast `label-md` descriptor, we create an editorial "High-Low" rhythm that feels intentional and premium.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are often a crutch for poor contrast. In this system, depth is earned through color logic.

- **The Layering Principle:** Place `surface-container-lowest` elements on top of `surface-container-low` backgrounds to create a soft, natural lift. This mimics how physical materials interact with light.
- **Ambient Shadows:** When a shadow is required for a floating state (e.g., a modal or a floating action button), use an extra-diffused blur (24px+) at a very low opacity (4%-8%). Tint the shadow with `primary` rather than pure black to keep the dark mode feeling "inky" and deep rather than muddy.
- **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use the `outline_variant` token at **15% opacity**. This creates a suggestion of a border that guides the eye without cluttering the layout.

---

## 5. Components

### Calculator Buttons (The Core)

- **Primary (Operators):** Background: `primary`. Text: `on_primary`. Roundedness: `md` (0.75rem).
- **Secondary (Numbers):** Background: `surface_container_high`. Text: `on_surface`.
- **Tertiary (Functions like C, ±, %):** Background: `surface_container_lowest`. Text: `primary`.
- **Visual Hierarchy:** The `=` button should span multiple columns or use the "Signature Gradient" to act as the primary anchor of the UI.

### Input Fields & Result Displays

- **The Display:** Should be borderless. Use `display-lg` for the current value.
- **Ghost Inputs:** For settings or account creation, use `surface_container_highest` with no border. On focus, transition the background color slightly or add a "Ghost Border" at 20% opacity.

### Lists (History Tape)

- **Constraint:** Forbid the use of divider lines.
- **Separation:** Use a vertical spacing of `spacing-4` (1rem) and subtle alternating background shifts (`surface` to `surface_container_low`) to separate calculation entries.

---

## 6. Do's and Don'ts

### Do:

- **Do** use `full` (9999px) roundedness for small chips and "Pro" badges to create a friendly SaaS contrast against the `md` roundedness of the main buttons.
- **Do** leverage Flexbox gap properties (`gap-4`) rather than individual margins to ensure a consistent airiness.
- **Do** use `primary_fixed_dim` for subtle hover states in dark mode to maintain the "violet" glow.

### Don't:

- **Don't** use pure black (#000000) for shadows or backgrounds. Always use the `on_surface` or `inverse_surface` tints to maintain tonal depth.
- **Don't** ever use a 1px solid border to separate the keypad from the display. Use a shift from `surface` to `surface_container`.
- **Don't** crowd the interface. If a layout feels tight, increase the container padding using `spacing-8` (2rem) to restore the "Premium SaaS" breathing room.
