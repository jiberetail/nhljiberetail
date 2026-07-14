# NHL Jibe Retail Suite

Standalone NHL retail dashboard suite recreated from the NHL Retail Suite Figma export. It includes performance dashboards, survey analytics, downloadable reports, inventory insights, podium management, and a Store Survey view connected to the independently deployed kiosk survey.

This repository is intentionally isolated from the MLB, Jets, Fan Town, and NHL kiosk survey codebases.

## Local development

```bash
pnpm install
pnpm run dev
```

## Production build

```bash
pnpm run build
pnpm run preview
```

GitHub Pages publishes the `dist` build from `main` using the workflow in `.github/workflows/deploy-pages.yml`.
