# AI Travel Planner

Plan smarter, travel better. A React + Vite app for planning trips to India and the 15 countries around it, with itineraries from **Claude** or **Gemini**, plus an offline demo mode.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5180.

## Choosing the AI

Click the **AI** button in the navbar (or "Itineraries by … · change" in the planner):

| Provider | What you need | Default model |
|---|---|---|
| Demo (offline) | Nothing — built-in sample itineraries | — |
| Claude (Anthropic) | An API key from platform.claude.com | `claude-opus-5-5` |
| Gemini (Google) | An API key from aistudio.google.com | `gemini-2.5-flash` |

You can type any model name your key can use. Keys are kept in this browser's localStorage only.

You can also preconfigure the AI with a `.env` file. Copy `.env.example` to `.env` and fill it in.

> The browser calls Claude/Gemini directly with the key you enter. That's fine for personal use. For a public website, move the calls in `src/ai/providers.js` behind your own server so keys never reach visitors.

If an AI request fails (bad key, quota, network), the app shows the reason and falls back to the offline sample planner.

## Where things live

- `src/ai/`: provider config, the SDK calls (`@anthropic-ai/sdk`, `@google/genai`), prompts and response parsing
- `src/data/`: destinations, the 15 neighbouring countries, travel modes and options
- `src/utils/planner.js`: the offline planner, the budget maths and the Companion presets
- `src/components/`: one component per section (Hero, Discover, Trending, TravelModes, SmartRoutes, TripBuilder, ItineraryDashboard, …)

Prices, durations and routes are indicative estimates, not live fares.
