# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bitcoin Korea Conference website (bitcoinkoreaconference.com). A bilingual (Korean/English) Next.js conference site with year-based editions (2025 archive, 2026 current).

## Commands

- `pnpm dev` - Start dev server (uses Turbopack)
- `pnpm build` - Production build (uses Turbopack)
- `pnpm start` - Start production server

No test runner or linter is configured.

## Architecture

**Framework:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4

**i18n:** `next-intl` with `ko` (default) and `en` locales. Routes are under `app/[locale]/`. Translation JSON files live in `app/messages/`. The i18n config is in `i18n/routing.ts`, `i18n/request.ts`, and `middleware.ts`.

**Year-based routing:**
- `app/[locale]/(2026)/` - Current year (route group, serves as `/[locale]`)
- `app/[locale]/2025/` - Previous year archive at `/[locale]/2025`

Each year edition has its own `_components/`, `layout.tsx`, and `page.tsx`. Shared visual components (animations, UI primitives) are in the top-level `components/` directory.

**Content/data pattern:** Conference data (speakers, schedules, sponsors, markets, attendees) is defined as TypeScript objects in `app/messages/2025/*.ts` and `app/messages/2026/*.ts`, keyed by locale (`en`/`ko`). UI strings use `next-intl` JSON message files.

**UI libraries:** shadcn/ui (new-york style), GSAP, Framer Motion (`motion`), Three.js, OGL, Lucide icons. Component registry includes ReactBits (`@react-bits`).

**Styling:** Tailwind CSS 4 with PostCSS. Custom local fonts: SUIT (body), Ubuntu Mono, Neurimbo Gothic — loaded via `next/font/local` in the root layout.
