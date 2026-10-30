# Rass by Riddhima — Design System Specification

## 1. Brand Identity & Vision
**Rass by Riddhima** is a luxury Indian jewellery brand bridging timeless heritage craftsmanship with contemporary editorial sensibility. The aesthetic is warm, spacious, restrained, polished, and authentic—eschewing heavy ornamentation, generic e-commerce templates, and saturated palettes in favor of refined minimalism and cultural grace.

---

## 2. Colour System & Tokens

### Palette
| Token Name | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| `--color-background` | `#FAF8F5` | Primary canvas, page background (Warm Ivory) |
| `--color-surface` | `#FFFFFF` | Cards, modals, drawers, input backgrounds (Pure White) |
| `--color-sage` | `#C8D4C1` | Newsletter background, organic decorative accents (Muted Sage) |
| `--color-lavender` | `#E2D5E5` | Announcement bar, decorative organic backdrop curves (Soft Lavender) |
| `--color-mauve` | `#A783A2` | Primary CTA buttons, cart badges, active accents (Dusty Mauve) |
| `--color-mauve-hover` | `#936E8F` | Darkened hover state for interactive mauve elements |
| `--color-antique-gold` | `#B49A6C` | Fine decorative accents, filigree dividers, subtle highlights |
| `--color-text` | `#292624` | Primary ink, headings, high-contrast typography |
| `--color-text-secondary` | `#77716F` | Secondary body text, metadata, captions, subtitles |
| `--color-border` | `#E7E0DA` | Hairline dividers, card outlines, subtle structural borders |

### Colour Distribution Target
- **70%–80%**: Warm Ivory (`#FAF8F5`) and Pure White (`#FFFFFF`)
- **10%–15%**: Muted Sage (`#C8D4C1`) and Soft Lavender (`#E2D5E5`)
- **5%–10%**: Dusty Mauve (`#A783A2`), Antique Gold (`#B49A6C`), and Primary Ink (`#292624`)

---

## 3. Typography System

### Typefaces
- **Display & Editorial Headings**: `Cormorant Garamond` (weights: 400 regular, 500 medium, italic accents), Fallbacks: `Didot, Garamond, Georgia, serif`.
- **Functional Text & UI**: `Manrope` (weights: 400 regular, 500 medium, 600 semi-bold), Fallbacks: `Inter, system-ui, -apple-system, sans-serif`.

### Responsive Typography Scale
| Element | Desktop | Mobile | Line Height | Letter Spacing | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Headline** | 56–64px | 36–42px | 1.05–1.15 | -0.01em | Cormorant Garamond |
| **Editorial Heading** | 42–48px | 32–36px | 1.1–1.2 | normal | Cormorant Garamond |
| **Page Title** | 40–48px | 32–38px | 1.15 | normal | Cormorant Garamond |
| **Section Heading** | 30–36px | 26–30px | 1.2 | normal | Cormorant Garamond |
| **Product Title** | 16–18px | 15–17px | 1.35 | normal | Cormorant Garamond / Manrope |
| **Body Text** | 15–16px | 14–15px | 1.55–1.7 | normal | Manrope (400) |
| **Navigation** | 13–14px | 14–16px | 1.4 | 0.04em | Manrope (500) |
| **Buttons** | 12–13px | 12–14px | 1.2 | 0.08em | Manrope (500) |
| **Eyebrows / Badges**| 11–12px | 10–12px | 1.2 | 0.20em–0.25em | Manrope (500, uppercase) |
| **Announcement Bar**| 10–11px | 9–10px | 1.3 | 0.18em–0.22em | Manrope (500, uppercase) |
| **Captions / Meta** | 11–12px | 11–12px | 1.4 | 0.05em | Manrope (400) |

---

## 4. Spacing, Sizing & Layout Rules

- **Base Grid**: 4px module.
- **Maximum Content Width**: 1200px–1320px container centered.
- **Horizontal Viewport Padding**:
  - Desktop (≥1024px): 48px–64px
  - Tablet (768px–1023px): 28px–36px
  - Mobile (≤767px): 18px–22px
- **Section Spacing**:
  - Desktop: 88px–120px vertical gap
  - Mobile: 56px–76px vertical gap
- **Radii**:
  - Image Cards: 8px–10px
  - Buttons / Badges / Input Pills: 9999px (full pill)
  - Modals / Drawers: 12px–16px
- **Interactive Sizing**:
  - Primary button height: 44px–48px
  - Input field height: 46px–52px
  - Circular icon buttons: 36px–40px
- **Shadows**:
  - Ultra-soft, diffused shadows: `0 8px 24px -6px rgba(41, 38, 36, 0.06)`

---

## 5. Architectural & Component Guidelines

1. **Header & Announcement Bar**:
   - Slim announcement bar in Soft Lavender (`#E2D5E5`) with symmetrical starburst accents (`✦`).
   - Sticky/Fixed header with lowercase editorial logo `rass` with `by riddhima`.
   - Subtle dot indicator for current active route.
   - Action icons with real badge counters and interactive modals/drawers.

2. **Toran Decoration**:
   - Custom SVG vector rendering featuring classical scalloped arches, mango leaves, and hanging jhumka/lotus pendants in sage and mauve.
   - Scales smoothly without overlapping nav or clipping at any viewport width.

3. **Asymmetric Category Gallery**:
   - 3-column masonry/staggered layout matching the design reference:
     - Left column: Rings (medium), Earrings (tall)
     - Middle column: Jhumka (short), Kangan Sets (portrait), Kangna (landscape)
     - Right column: Necklaces (very tall), Bracelets (medium), Kangna (landscape)
   - Bottom-left uppercase category labels and bottom-right circular white arrow buttons.
   - Smooth hover zoom and elevation transition.

4. **Editorial Storytelling**:
   - Section A: "Rooted in tradition, made for today" with organic curved backdrop shapes and artisan craftsmanship photo.
   - Section B: "Everyday moments" with domed arch photo frame and botanical illustration.
   - Pill CTAs linking to storytelling and collection views.

5. **Newsletter & Organic Curves**:
   - Soft wave transitions into Muted Sage (`#C8D4C1`).
   - Clean email input and circular mauve submit button with instant validation and feedback.

6. **Footer**:
   - Comprehensive multi-column navigation, brand statement, newsletter, policy links, and copyright.
