# HoodPing

HoodPing is a neighborhood community board as a mobile app: discover and share everyday items, activities, and events around you.

Built with Vue 3 + TypeScript + Tauri.

## Tech stack

- Vue 3 (`<script setup>`), TypeScript, Vite 6
- Tailwind CSS 4, Pinia, Vue Router (hash history for Tauri)
- Leaflet + MapTiler (map tiles + reverse geocoding)
- Tauri 2 (mobile/desktop shell), Geolocation plugin

## Prerequisites

- [Bun](https://bun.sh) (this repo builds with `bun run build`; plain `npm` may not be on PATH)
- A MapTiler API key for map tiles and geocoding

## Getting started

```bash
bun install
cp .env.example .env   # then fill in VITE_MAPTILER_API_KEY
bun run dev            # Vite dev server, default port 1420
```

Other scripts:

```bash
bun run build    # vue-tsc --noEmit && vite build
bun run preview  # preview the production build
bun run tauri    # Tauri CLI
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_MAPTILER_API_KEY` | Yes | MapTiler key used for map tiles and reverse geocoding in `src/stores/location.ts` |

Without a key the app falls back to `"My Location (Offline)"`.

## Test login

Auth is currently local-only (no backend). Use:

- Email: `test@example.com`
- Password: `testpassword`

Login state is persisted in `localStorage` (`hoodping_auth`). Registration is UI-only and redirects to login; Apple/Google buttons are disabled placeholders.

## Project structure

```
src/
  views/           # LoginView, RegisterView, FeedView, ChatView, ProfileView, SettingsView
  components/
    feed/          # CardFeed, LookingForCard, OfferingCard, CardFooter
    layout/        # AppHeader, BottomNav, QuickFilterBar, CreateSheet, LocationModal, ProfileMenu
  stores/          # user, theme, feed, location (Pinia)
  types/           # CardType, FilterCategory, FeedItem, PhonePrefix, Coordinates
  router/          # /login, /register, /, /chat, /profile, /settings + auth guard + 404 catch-all
```

## Features

- Auth pages with validation, error states, and disabled social login buttons
- Feed with category filters, empty state, and create sheet (500-char limit with counter)
- Location modal with Leaflet map, discovery-radius slider, and dark/light tiles
- Dark/light theme with persistence
- Accessibility: landmarks, labels, `aria-pressed`, `role="switch"`/`menu`, Escape-to-close, `prefers-reduced-motion`, 44px touch targets

## Notes

- Hash-based routing (`createWebHashHistory`) is intentional for Tauri builds without server-side fallback.
- The MapTiler key is a client-side publishable key (sent in tile/geocoding URLs by design) but is kept out of git via `.env` — only referenced as `import.meta.env.VITE_MAPTILER_API_KEY`.

## Copyright

© 2026 Phillip Hemleb. All rights reserved.
