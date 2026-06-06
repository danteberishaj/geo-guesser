# 🌍 Geo Guesser

A GeoGuessr-style geography game. You're dropped into a random street-level
panorama somewhere in the world — explore it, then drop a pin on the map to
guess where you are. The closer your guess, the more points you score, across
five rounds.

Built with **Vue 3**, **Pinia**, **TypeScript**, and **Vite**. Street imagery
comes from [Mapillary](https://www.mapillary.com/) (free, open) and the guessing
map uses [Leaflet](https://leafletjs.com/) with OpenStreetMap/CARTO tiles.
Entirely frontend — no backend or accounts.

## Features

- 🗺️ Random 360° street-level panoramas via Mapillary
- 📍 Click-to-guess Leaflet map that expands on hover
- 🎯 Distance-based scoring (0–5000 per round, exponential decay)
- 📊 Animated scores, per-round breakdown, and a final performance rating
- ⌨️ Keyboard support (Enter to guess / advance) and reduced-motion friendly
- 🌙 Cohesive dark theme

## Prerequisites

- **Node.js 18+**
- A free **Mapillary access token** (see below)

## Getting a Mapillary token

1. Sign up at [mapillary.com](https://www.mapillary.com/) and open the
   [Developer dashboard](https://www.mapillary.com/dashboard/developers).
2. **Register an application.** Use `http://localhost:5173` as the callback URL.
3. **Enable the `read` scope.** This is required — without it the app can read
   coverage tiles but *not* image data, and the street view will fail to load
   with a "missing permissions" error.
4. Copy the **Client token** (format `MLY|<id>|<hex>`).

## Setup

```bash
# Install dependencies
npm install

# Configure your token
cp .env.example .env
# then edit .env and paste your token:
# VITE_MAPILLARY_TOKEN=MLY|...|...
```

`.env` is gitignored, so your token stays local.

## Running

```bash
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check (vue-tsc) and build for production
npm run preview   # preview the production build
npm run test      # run unit tests (Vitest)
```

The app runs without a token, but shows a setup hint instead of loading
panoramas.

## How it works

- **Picking a location** — Mapillary has no "random image" endpoint, so the app
  keeps a curated list of city centre points
  ([`src/data/locations.ts`](src/data/locations.ts)). Each round it picks a
  random city, fetches the Mapillary **coverage vector tile** (zoom 14) for that
  area, parses the `image` layer, and selects a random panorama — preferring
  360° images. See [`src/services/mapillary.ts`](src/services/mapillary.ts).
- **Guessing** — Leaflet map; clicking drops a pin and records its coordinates.
- **Scoring** — great-circle (haversine) distance between guess and actual,
  converted to points via `5000 · e^(−km / 2000)`
  ([`src/utils/scoring.ts`](src/utils/scoring.ts)). Max 25,000 over five rounds.
- **State** — a Pinia store ([`src/stores/game.ts`](src/stores/game.ts)) drives
  the flow: `idle → loading → playing → revealed → finished`.

> **Note on the Graph API:** Mapillary's `graph.mapillary.com/images` bbox
> search is slow and rate-capped for city-sized areas, so the app deliberately
> uses the coverage **tiles** API instead, which is fast and reliable.

## Project structure

```
src/
  main.ts                 # app bootstrap (Pinia + CSS)
  App.vue                 # screen switching by game status
  types/game.ts           # LatLng, GameStatus, Round
  data/locations.ts       # curated city centre points
  services/mapillary.ts   # fetch random panoramas from coverage tiles
  utils/
    distance.ts           # haversine distance
    scoring.ts            # distance → score
    format.ts             # distance formatting + rating labels
    mapTiles.ts           # shared dark Leaflet tile layer
  composables/
    useCountUp.ts         # animated number count-up
  stores/game.ts          # Pinia game state & actions
  components/
    GameHud.vue           # round progress + score
    StreetView.vue        # mapillary-js panorama viewer
    GuessMap.vue          # Leaflet guessing map
    RoundResult.vue       # per-round result (distance, score, line)
    GameSummary.vue       # final totals + play again
```

## Configuration

Tunable single constants:

- Rounds per game — `ROUNDS_PER_GAME` in [`src/stores/game.ts`](src/stores/game.ts)
- Scoring decay — `DECAY_KM` in [`src/utils/scoring.ts`](src/utils/scoring.ts)
- Locations — add bounding city points to [`src/data/locations.ts`](src/data/locations.ts)

## License

MIT
