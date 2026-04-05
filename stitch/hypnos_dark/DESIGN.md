# Design System Strategy: The Nocturnal Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Sanctuary"**

This design system is built to be a silent companion in the dark. It rejects the aggressive, high-contrast rigidity of traditional productivity apps in favor of a fluid, "Obsidian Sanctuary" aesthetic. We move beyond the "template" look by utilizing extreme tonal depth and intentional asymmetry. The UI does not sit *on top* of the screen; it emerges *from* it. By prioritizing soft, rounded forms and heavy breathing room, we ensure the interface feels as gentle as a whisper, reducing cognitive load and eye strain for the late-night user.

## 2. Colors: Tonal Atmosphere
The palette is rooted in the transition from dusk to deep night. We avoid pure blacks to prevent "black smear" on OLED screens, instead using a base of `#121319`.

### The "No-Line" Rule
**Explicit Instruction:** Designers are strictly prohibited from using 1px solid borders to section content. Hierarchy must be achieved through background shifts. A `surface-container-low` component should sit on a `surface` background to define its bounds. If you feel the need for a line, you haven't used your surface tiers correctly.

### Surface Hierarchy & Nesting
Treat the interface as physical layers of "Ink and Glass." 
- **Base Layer:** `surface` (#121319) - The canvas.
- **Mid Layer:** `surface-container` (#1e1f26) - For primary interaction zones.
- **Top Layer:** `surface-container-highest` (#34343b) - For transient elements or active states.
*Rule:* Inner containers must always be at least one tier higher or lower than their parent to create a "nested" depth that guides the eye without structural clutter.

### The "Glass & Gradient" Rule
Floating elements (like a timer adjustment wheel) must utilize Glassmorphism. Use `surface-variant` at 60% opacity with a `20px` backdrop blur. 
**Signature Textures:** For the main "Start" CTA, do not use a flat color. Apply a subtle linear gradient from `primary` (#bac3ff) to `primary-container` (#00115e) at a 45-degree angle to give the element a tactile, luminous soul.

---

## 3. Typography: The Gentle Voice
We use **Plus Jakarta Sans** for high-impact display moments to provide a premium, modern feel, paired with **Manrope** for body text due to its exceptional legibility and rounded terminals.

- **Display (Lg/Md/Sm):** *Plus Jakarta Sans.* Use for the primary timer countdown. The wide apertures ensure clarity even at 5% brightness.
- **Headline & Title:** *Plus Jakarta Sans.* Set with slightly tighter letter spacing (-0.02em) to create an editorial, "locked-in" feel.
- **Body & Label:** *Manrope.* These are your workhorses. The geometric yet soft nature of Manrope ensures that "Cancel" or "Settings" options feel approachable, not clinical.

---

## 4. Elevation & Depth: Tonal Layering
We abandon the 2010-era drop shadow. Depth is now a function of light and material density.

- **The Layering Principle:** To "lift" a sleep preset card, place it on `surface-container-lowest`. The natural contrast against the `surface` background creates a soft "sink-in" effect rather than a "pop-out" effect.
- **Ambient Shadows:** For floating Modals, use a shadow with a `48px` blur, `0px` offset, and `6%` opacity using the `on-surface` color. This mimics the way a soft lamp would cast light in a dark room.
- **The "Ghost Border" Fallback:** If accessibility requires a boundary, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.
- **Glassmorphism:** Apply to navigation bars. Use `surface_container_lowest` with a `backdrop-filter: blur(12px)` to allow the deep indigo of the background to bleed through, softening the transition between sections.

---

## 5. Components

### Buttons (Tactile Triggers)
- **Primary:** Gradient-filled (`primary` to `primary-container`), `xl` (3rem) roundedness. No shadow.
- **Secondary:** `surface-container-high` fill with `secondary` (#ffb954) text.
- **Tertiary:** Ghost style. No fill, `on-surface-variant` text. High padding (16px 24px).

### Chips (Sleep States)
- Use `full` (9999px) roundedness. 
- Active state: `secondary-container` background with `on-secondary-container` text.
- Inactive state: `surface-container-highest` background.

### Cards & Lists (The "Anti-Grid")
- **Forbidden:** Horizontal dividers/lines.
- **The Method:** Use `1.5rem` (md) vertical spacing and subtle shifts to `surface-container-low` to group sleep sounds or timer presets. 
- **Interaction:** On tap, a card should subtly scale to 0.98 and shift color to `surface-container-highest`.

### Input Fields (Quiet Inputs)
- Minimalist containers using `surface-container-lowest`. 
- **Focus State:** Instead of a thick border, use a soft outer glow (4px) using the `primary` color at 20% opacity.

### Custom Component: The "Luma-Slider"
For volume or brightness, use a wide track (`lg` roundedness) with a `primary` fill and a `secondary` thumb. The thumb should have a `10px` blur shadow to look like a glowing ember.

---

## 6. Do's and Don'ts

### Do
- **DO** use asymmetry. Place the "Start" button off-center or use oversized typography that bleeds slightly toward the edge to create an editorial feel.
- **DO** prioritize "Negative Space." If the screen feels empty, you are doing it right. Late-night users need air.
- **DO** use `secondary` (muted amber) for active timer states—it mimics the "Night Shift" warmth of the OS.

### Don't
- **DON'T** use 100% white (#FFFFFF). Always use `on-surface` (#e3e1ea) to prevent "retina burn."
- **DON'T** use standard iOS "Chevron" icons for lists. Use subtle background shifts or organic spacing to imply clickability.
- **DON'T** use "Snap" animations. All transitions must be "Ease-Out-Cubic" with durations between 400ms and 600ms to mimic the slow pace of falling asleep.