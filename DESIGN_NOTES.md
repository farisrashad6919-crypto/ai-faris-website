# Design Notes

## Creative direction

This implementation interprets “The Articulate Authority / The Academic Executive” as a personal-brand experience that feels:

- editorial rather than startup-like
- intellectual rather than promotional
- calm, premium, and layered rather than loud
- tailored to a respected individual mentor rather than a tutoring marketplace

## Visual translation

### Color and surface system

- Warm cream, vellum-inspired base surfaces anchor the site.
- Tonal layering replaces heavy borders.
- Soft shadows use bronze and muted slate influence rather than pure black.
- Floating UI such as the header and secondary buttons uses a frosted-glass treatment.

### Typography

- `Noto Serif` handles English and Turkish display text.
- `Manrope` handles English and Turkish UI/body text.
- `Noto Naskh Arabic` and `Noto Sans Arabic` provide the Arabic editorial pairing.
- The font system switches by locale using CSS variables so components remain reusable.

### Layout language

- The homepage hero uses editorial asymmetry with a weighted portrait composition.
- Sections rely on spacing, rhythm, and staggered depth rather than dense card walls.
- Arabic layout uses proper `dir="rtl"` handling at the root plus mirrored flow where needed.

### Motion

- Motion is restrained and performance-conscious.
- Section reveals use small upward fades with `LazyMotion`.
- The site respects reduced-motion preferences.

## Experience choices

- Booking remains the primary CTA path.
- If a live booking URL is not configured, CTAs route to the localized inquiry form anchor instead of breaking.
- Social proof is presented with public profile facts and adapted public review themes rather than fabricated claims.

## Implementation notes

- Tokens are defined in `src/app/globals.css` through CSS variables and Tailwind theme bindings.
- Shared UI primitives live in `src/components/ui` and `src/components/sections`.
- Locale-aware routing and navigation live in `src/i18n`.
- SEO, hreflang, sitemap, robots, and JSON-LD are implemented in the App Router.
