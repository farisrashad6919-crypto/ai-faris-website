# Faris Rashad English Trainer Website

Production-quality multilingual personal-brand website built with Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, and `next-intl`.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- next-intl
- lucide-react
- Zod
- Vitest + Testing Library

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

The root route redirects to `/en`, `/ar`, or `/tr` based on the browser language, with English as the fallback.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## Project structure

```text
messages/                 Locale messages for en, ar, tr
public/images/            Brand imagery and portrait assets
src/app/                  App Router routes, metadata routes, icons, sitemap, robots
src/components/           Layout, section, page, and form components
src/config/site.ts        Editable brand details, links, and public profile facts
src/features/contact/     Contact form server action
src/i18n/                 Routing, navigation, and request config
src/lib/                  Metadata, locale helpers, schema helpers, message loading
```

## Editable brand data

Update these first when moving from the scaffold to production:

- `src/config/site.ts`
  - `siteUrl`
  - `bookingUrl`
  - `whatsappUrl`
  - `email`
  - `instagramUrl`
  - `youtubeUrl`
  - social links and public profile snapshot data
- `messages/en.json`
- `messages/ar.json`
- `messages/tr.json`

## Verification status

This implementation currently passes:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Notes

- Arabic routes render with proper RTL direction handling.
- If no live booking link is configured, booking CTAs fall back to the localized contact form anchor.
- The contact form currently validates and succeeds inside the app, and is ready for live delivery wiring later.

See also:

- [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)
- [DESIGN_NOTES.md](./DESIGN_NOTES.md)
