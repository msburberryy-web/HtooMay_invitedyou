---
name: painting-first-wedding-web
description: Implement approved painterly wedding-website concepts as layered raster artwork plus responsive HTML motion, especially when decorative stationery objects must match a watercolor art direction.
---

# Painting-first wedding web

Use the approved concept image as the visual source of truth. Preserve its composition, scale hierarchy, paper proportions, palette, texture, and negative space when moving from planning into implementation.

## Layer decision

- Generate or extract painterly visual objects as local PNG/WebP layers: paper, ribbon, botanicals, pearls, florals, tickets, stamps, illustrations, and similar handmade decorations.
- Use CSS only for layout, responsive sizing, stacking, clipping, opacity, transforms, and motion.
- Do not imitate painterly objects with CSS gradients, borders, glyphs, box-shadows, or pseudo-element drawings when they are visible parts of the approved art direction.
- Keep text, language controls, form fields, and accessibility semantics in HTML unless the user explicitly requests baked artwork text.

## Implementation

Separate the background plate from interactive foreground objects. Use transparent artwork assets for elements that move independently. Validate genuine alpha before integration and keep replaceable assets in clearly named local folders.

For scroll animation, preserve the existing reliable engine. Animate artwork primarily with transforms and opacity, make backward scrolling reverse naturally, and ensure the static completed composition matches the approved concept at both desktop and mobile sizes.

Before publishing, compare a rendered capture directly with the approved concept. Correct material or compositional drift before treating the implementation as complete.
