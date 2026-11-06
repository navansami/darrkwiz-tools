# Navan Brand Website Style Guide

This guide describes the visual system currently used by **Navan | Software Engineer**. Use it as a practical blueprint when carrying the brand into another site. The portfolio and Build Lab share typography, orange accents, precise spacing, and motion behavior; the portfolio uses a dark editorial canvas while the learning area has its own light documentation canvas.

## Brand character

- **Editorial and technical:** oversized display typography paired with small, carefully spaced metadata.
- **Warm and tactile:** near-black backgrounds, warm off-white text, restrained orange, thin rules, subtle grids, and atmospheric glow.
- **Playful through movement:** motion feels deliberate and continuous, with physical inertia in the hero sculpture and restrained reveals elsewhere.
- **Readable first:** small labels are accents, never the only way to understand an action or section.

Avoid generic gradients, blue/purple SaaS palettes, rounded-everything cards, and constant bouncing. Orange is a signal color; keep most surfaces quiet so it has impact.

## Design tokens

```css
:root {
  /* Portfolio */
  --paper: #eae8df;
  --ink: #111210;
  --muted: #92948b;
  --orange: #ff5b2d;
  --line: #343630;

  /* Typography */
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "DM Sans", Arial, sans-serif;
  --font-editorial: Georgia, "Times New Roman", serif;

  /* Useful geometry */
  --page-max: 1680px;
  --page-gutter: 6%;
  --header-height: 100px;
  --section-space: clamp(88px, 11vw, 150px);
  --ease-out: cubic-bezier(0.2, 0.65, 0.2, 1);
}
```

Use the orange from the active site (`#ff5b2d`) for the portfolio. The tutorial/docs surfaces use a slightly deeper orange (`#ed5027`) against white, with dark sidebar surfaces. Keep these values scoped so the two modes remain distinct:

```css
.learning-docs {
  --docs-orange: #ed5027;
  --docs-ink: #20231e;
  --docs-muted: #6b7167;
  --docs-line: #e1e4dc;
  --docs-soft: #f5f6f1;
  color: var(--docs-ink);
  background: #fff;
}
```

### Color usage

| Role | Value | Use |
| --- | --- | --- |
| Ink | `#111210` | Portfolio background, dark panels, body text on light surfaces |
| Paper | `#eae8df` | Main text on dark surfaces, inverse button text |
| Orange | `#ff5b2d` | Links, small markers, emphasis, active states, primary CTA |
| Muted | `#92948b` | Secondary copy and supporting labels |
| Rule | `#343630` | Dividers and subtle card outlines |
| Docs orange | `#ed5027` | Learning area accent on white |
| Docs surface | `#fff` / `#171717` | Documentation canvas / sidebar |

Use alpha versions of white and orange for overlays and glows. The hero grid is intentionally barely visible; it should be discovered rather than compete with the headline.

## Typography

Load **Space Grotesk** (400–700) and **DM Sans** (400, 450, 500, 600, 700). Use Space Grotesk for display headlines, wordmarks, and prominent section headings; DM Sans for reading text, navigation, and UI. Georgia italic is the expressive editorial accent, used sparingly for one word or phrase in a large heading.

- Hero headline: `clamp(90px, 10.4vw, 176px)`, weight 600, line-height `.84`, letter-spacing `-.075em` on desktop. Scale to roughly `21vw` on narrow mobile and preserve the tight line height.
- Section headings: `clamp(45px, 7vw, 85px)`; tight tracking and compact line-height.
- Body copy: 16–18px with 1.6–1.75 line-height. Do not shrink supporting text into unreadable metadata.
- Eyebrows: 12–13px, uppercase, letter-spacing around 1.5–1.7px, muted color.
- Navigation: 14–16px. Use tiny numbering as secondary detail, not as the main label.
- Code/docs: DM Sans for prose; monospace for code, keyboard hints, and technical metadata.

Prefer sentence case for explanatory copy. Reserve uppercase for short labels, not paragraphs.

## Layout and components

### Portfolio shell

- Center content at a maximum width of 1680px; use 6% side gutters.
- Header is approximately 100px tall, aligned to the page edges, with a subtle bottom rule. Wordmark is Space Grotesk 700 around 37px with tight negative tracking; the orange asterisk is a small animated brand mark.
- Sections use generous vertical spacing (`clamp(88px, 11vw, 150px)`) and thin separators. Keep grids and cards aligned to consistent columns.
- Use square or lightly rounded corners. Borders are hairline and low contrast; reserve solid orange fills for prominent actions.

### Hero

- Full viewport composition, with a minimum height around 850px and a maximum around 1200px on desktop.
- Dark base with a soft warm radial glow on the artwork side and a faint structural grid.
- Headline occupies the left; the interactive particle sculpture fills the right. Supporting intro and project CTA sit in their own legible panel/zone and must not overlap the main headline or button.
- Use the orange italic serif treatment on one key phrase to create contrast against the heavy sans headline.
- Bottom edge contains low-key scroll/brand cues. Keep these far below the headline’s reading path.

### Buttons, links, and cards

- Primary CTA: orange circular or pill-shaped surface, dark text, clear verb, optional arrow. Make the hit area generous (at least 44px high/wide).
- Links change to orange on hover; arrows may drift a few pixels. Avoid layout shifts on hover.
- Cards use dark surfaces, subtle borders, and restrained pointer glow. Any pointer-follow effect must remain behind text and must never reduce contrast.
- Focus-visible uses a 2px orange outline with a 6px offset on portfolio controls. Documentation controls use a 3px outline with a 4px offset.

### Build Lab / learning docs

The learning area is intentionally a separate reading environment. Keep its main reading canvas white, body text dark, and navigation/sidebar near-black. Orange marks active navigation, code accents, links, and progress. Use a sticky dark header, a dark side navigation, and a spacious white article column. At small sizes, the side navigation becomes a full-screen drawer. Keep the shared fonts and orange identity, but do not carry the portfolio’s dark page background into the article content.

## Motion language

Motion is purposeful, smooth, and mostly low-frequency. Use opacity and transform; avoid animating layout properties. Keep the main read stable while decorative elements move.

| Effect | Current behavior | Reuse guidance |
| --- | --- | --- |
| Headline entrance | Lines rise from below with a slight 3° rotation; settles cleanly | One-time entrance, about 0.8–1s, stagger lines subtly |
| Scroll reveal | Starts 40px below; opacity + transform over 850ms with a soft ease-out | Trigger once when 8% of an element enters view |
| Orange asterisk | Full rotation every 18s, linear | Use only on the wordmark/brand mark |
| Discipline marquee | Continuous leftward loop, 40s | Duplicate content seamlessly; pause with global motion setting |
| Scroll indicator | Travels about 55px | Slow and low contrast |
| Floating interface mockups | Small 6–8px travel, gentle tilt | Long loops (roughly 5–7s), alternating directions |
| Arrows / equalizer | 10px diagonal drift / short scale rhythm | Small supporting details only |
| 3D particle sculpture | 30fps cap; continuous slow drift plus drag inertia | See interaction recipe below |

Example reveal and entrance patterns:

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 850ms ease,
    transform 850ms cubic-bezier(0.2, 0.65, 0.2, 1);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes title-enter {
  from { transform: translateY(120%) rotate(3deg); }
  to   { transform: translateY(0) rotate(0); }
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}
```

Use `IntersectionObserver` with a threshold near `.08`, add the visible class once, and unobserve after reveal. Stagger only a few related items (about 100–200ms between them); avoid a cascade that delays reading.

### Interactive sculpture behavior

The hero sculpture is a canvas-rendered 3D torus knot: 115 rings × 19 points, 100 ambient dust particles, perspective projection, orange/paper point shading, and fine connecting threads. It is decorative but responds directly to the visitor:

- Pointer drag rotates around X and Y. Release carries the rotation forward with velocity and exponential damping (`exp(-5 × delta)`), while a slow idle rotation continues.
- Shift + drag rolls around Z. Keyboard arrows rotate; `+` / `-` zoom; `R` resets; Escape stops current inertia.
- Zoom is clamped between `.65×` and `1.5×`.
- Cap device pixel ratio (currently 1.75) and render at roughly 30fps. Stop when the canvas leaves the viewport or the tab is hidden.
- Use pointer capture, touch-friendly input, a visible drag hint, keyboard focus, and an accessible label. Do not add visible reset/pause controls unless the interaction requires them.

For another site, reuse the behavior and rendering principles rather than copying the exact geometry blindly. If canvas/WebGL is too costly for that page, keep the dark atmosphere and implement a lighter SVG/CSS orbital motif with the same drag-to-rotate and momentum feel.

## Global motion control and accessibility

The portfolio has a user-controlled motion setting. Its default state is paused; the user can explicitly enable motion. When paused, CSS animations stop, reveals remain visible, the custom cursor is hidden, and the particle sculpture stops. Also respect `prefers-reduced-motion: reduce`: remove nonessential movement, make content immediately visible, and disable smooth scrolling. Never rely on animation to communicate content or state.

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Other essentials:

- Maintain strong text/background contrast and comfortable body sizes.
- Provide visible keyboard focus, semantic headings, skip navigation, and descriptive link/button text.
- Hide custom cursors on touch devices; do not make hover the only way to reveal information.
- For canvas visuals, include an accessible text alternative and keyboard controls.
- Keep touch targets at least 44×44px and prevent sideways overflow.

## Responsive behavior

Use fluid sizing first, then switch compositions at clear layout thresholds. Current portfolio behavior pivots around 1100px and 760px, with an extra compact pass at 370px. The docs navigation becomes a full-screen mobile menu at 700px. A practical starting set for new sites:

```css
/* Wide desktop */
@media (min-width: 1700px) { /* cap content width; preserve generous hero */ }
/* Tablet / compact laptop */
@media (max-width: 1100px) { /* reduce columns and navigation gaps */ }
/* Mobile */
@media (max-width: 760px) { /* stack content; recompose hero and navigation */ }
/* Narrow mobile */
@media (max-width: 370px) { /* protect type and CTA from clipping */ }
```

On mobile, let the hero become taller rather than compressing the headline and artwork into a crowded viewport. Stack supporting copy and CTA into distinct rows, keep the artwork behind/adjacent to text with controlled opacity, and use a full-screen menu for the docs sidebar. Check 320px-wide screens as well as modern phones.

## Implementation checklist

1. Add the color and typography tokens; load the two brand fonts.
2. Set a near-black portfolio canvas, warm paper text, orange accent, faint rules, and a centered max-width wrapper.
3. Build the hero hierarchy: navigation, eyebrow, oversized headline, distinct supporting-copy/CTA zone, and artwork.
4. Add restrained reveal, marquee, and hover behavior; wire all nonessential motion into one user control.
5. Build the learning/docs area with a white article surface and black navigation.
6. Reflow at tablet/mobile widths and verify no type, buttons, or content overlap.
7. Add keyboard alternatives and reduced-motion behavior before polishing decorative effects.

## Source reference

The guide is based on the current implementation in `app/globals.css`, `app/layout.tsx`, `components/MotionExperience.tsx`, `components/OrbitalArtwork.tsx`, and `app/lab/lab.css`. Those files are the authoritative reference if implementation details change later.
