---
name: EcoTech Synthesis
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005ac2'
  on-tertiary: '#ffffff'
  tertiary-container: '#71a1ff'
  on-tertiary-container: '#00367a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system is engineered to bridge the gap between heavy industrial operations and the precision of high-tech clean energy. It targets stakeholders and operators within the waste-to-energy and recycling sectors, evoking a sense of **environmental stewardship, operational reliability, and technological advancement**.

The visual style is **Corporate / Modern** with a slight lean toward **Glassmorphism** for data overlays. It prioritizes clarity and efficiency, utilizing generous whitespace to reduce the cognitive load of a multi-system hub. The aesthetic is "High-Resolution Industry"—sharp, clean, and forward-thinking, moving away from the cluttered and dated appearances of traditional industrial software.

## Colors
The palette is rooted in the "Clean Energy Green" (Primary), representing growth and eco-friendly technology. This is anchored by "Deep Industry Blue" (Secondary) to provide a professional, authoritative foundation. 

- **Primary (Clean Energy Green):** Used for success states, primary actions, and progress indicators.
- **Secondary (Deep Industry Blue):** Used for navigation backgrounds, headers, and primary text to establish depth and hierarchy.
- **Tertiary (High-Tech Blue):** Reserved for interactive links and secondary information highlights.
- **Slate Grays:** Utilized for borders, secondary text, and subtle UI backgrounds to maintain a clean, high-tech neutral environment.
- **System States:** Standardized Red for alerts, Amber for warnings, and Primary Green for "System Online" or "Efficiency Target Met" status.

## Typography
This design system utilizes **Inter** exclusively to ensure maximum legibility across high-density data dashboards and mobile interfaces. The typographic scale is designed for functional clarity.

Headlines use tight letter-spacing and heavier weights to feel "engineered" and sturdy. Body text maintains a generous line height to ensure readability during long operational monitoring sessions. Labels use a medium weight to stand out against data values without requiring excessive size.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict vertical rhythm. 

- **Desktop:** A 12-column grid with a fixed sidebar (280px) for high-level system navigation. Content resides in a fluid container with a 1440px max-width to prevent line lengths from becoming unreadable on ultra-wide monitors.
- **Tablet:** Sidebar collapses into a rail or hamburger menu. The grid transitions to 8 columns.
- **Mobile:** A single-column layout with 16px (1rem) side margins.

Spacing follows a base-8 scale (8px, 16px, 24px, 32px, etc.) to ensure consistent alignment and a structured, "modular" feel that reflects the industrial nature of the business.

## Elevation & Depth
To achieve a high-tech aesthetic, the design system utilizes **Tonal Layers** combined with **Ambient Shadows**. 

1.  **Floor:** The lowest level is the `#F8FAFC` background.
2.  **Surface:** Main content cards use a pure white surface with a very soft, diffused shadow (`0px 4px 20px rgba(15, 23, 42, 0.05)`).
3.  **Raised:** Active elements, modals, or hovering cards use a secondary shadow tier that is slightly more pronounced to simulate physical lift.
4.  **Overlays:** Dropdowns and tooltips utilize a subtle **Backdrop Blur** (8px) to feel like semi-transparent glass, suggesting advanced software sophisticatedness.

Outlines are avoided unless used as a low-contrast "ghost border" (`1px solid #E2E8F0`) to define card boundaries on white backgrounds.

## Shapes
The shape language is defined as **Rounded**. This provides a friendly, modern feel that softens the "cold" industrial data. 

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Large Elements (Cards, Modals):** 1rem (16px) corner radius.
- **System Tags/Pills:** 1.5rem (24px) or fully pill-shaped to contrast against the more rectangular card structures.

## Components

- **Buttons:** Primary buttons use a solid Green fill with white text. Secondary buttons use a Slate Gray outline with the Secondary Blue text. Hover states should include a subtle darkening of the fill color and a slight increase in shadow depth.
- **Cards:** System hub cards should feature a top-aligned icon in a tinted background container (e.g., Green icon on 10% Green background). Title text is `headline-md`, followed by a short description in `body-md`.
- **Inputs:** Fields use a 1px Slate border that turns Primary Green on focus. Labels are placed above the field in `label-sm`.
- **Navigation Sidebar:** High-contrast background (Secondary Blue) with white/gray icons. Active states use a "Power Bar"—a vertical Green line on the left edge of the active menu item.
- **Status Chips:** Small, pill-shaped indicators (e.g., "Active", "Offline", "Maintenance") using a low-opacity background of the status color (e.g., 10% Red for "Offline") and high-contrast text.
- **Progress Bars:** Thin, clean bars using the Primary Green to denote efficiency or task completion levels, housed in a light gray track.