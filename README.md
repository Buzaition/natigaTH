# Natiga

Responsive Arabic high-school-results lookup site.

## What It Does

- Searches only by numeric seat number.
- Loads static lookup shards from `public/data`.
- Shows student name, total score out of 320, percentage, and student status.

The generated lookup data is required for the live static website. The source Excel workbook is intentionally excluded from Git.

## Requirements

- Node.js `>=22.13.0`

## Commands

```bash
npm install
npm run build
npm test
```

## Project Shape

- `app/` contains the page, metadata, and styles.
- `public/data/` contains generated static result shards used by the browser lookup.
- `next.config.ts` keeps the project deployable as a standard Next.js app on Vercel.
