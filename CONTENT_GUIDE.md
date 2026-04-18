# Content Guide

## Where to edit translations

All localized copy lives in:

- `messages/en.json`
- `messages/ar.json`
- `messages/tr.json`

The JSON structure is parallel across all three locales. If you add or rename a key in one file, mirror that change in the other two files.

## What each section contains

- `Metadata`
  - Page titles, descriptions, and keywords for SEO
- `Navigation`
  - Header and mobile navigation labels
- `Footer`
  - Footer copy and source note
- `Home`, `About`, `Services`, `Results`, `Contact`
  - Full page content, section headings, cards, FAQs, and form labels

## Where to edit personal and external details

Use `src/config/site.ts` for:

- Brand name
- Site URL
- Booking link
- WhatsApp link
- Email
- LinkedIn / Preply / social links
- Portrait path
- Public profile snapshot values
- Verified background facts

## Contact flow

The contact form UI text is localized in `messages/*`.

The current server action is here:

- `src/features/contact/actions.ts`

This version validates and completes successfully inside the app. To connect real delivery later, update the `deliverInquiry` logic in that file and the public contact values in `src/config/site.ts`.

## SEO and structured data

These files control SEO and metadata behavior:

- `src/lib/metadata.ts`
- `src/lib/schema.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/opengraph-image.tsx`
- `src/app/twitter-image.tsx`
- `src/app/icon.tsx`

## Portrait and assets

The current portrait is stored at:

- `public/images/faris-portrait.jpg`

If you replace it, keep the same path or update `portraitPath` in `src/config/site.ts`.
