/*
 * AI planning layer. When a Claude or Gemini key is configured, itineraries
 * and Companion adjustments come from the model; otherwise (or on any error)
 * the app falls back to the offline sample planner in utils/planner.js.
 */
import { getDestination } from '../data/destinations';
import { GROUPS, PACES, PERSONALITIES, TIERS, TRAVEL_MODES } from '../data/options';
import { tripLength, sortByTime } from '../utils/planner';
import { addDays, uid } from '../utils/format';
import { complete, parseJSON } from './providers';

const TAGS = ['nature', 'food', 'culture', 'adventure', 'relax', 'shopping'];

const SYSTEM = `You are the trip-planning engine inside an Indian travel-planning web app.
You design realistic, specific day-by-day itineraries using real, named places at the destination.
Respond with a single JSON object only — no markdown, no commentary.
All costs are indicative per-person amounts in Indian rupees (INR), as plain integers.
Times use 24-hour "HH:MM". Keep descriptions short and concrete.`;

const SCHEMA = `{
  "summary": "one sentence describing the trip's character",
  "days": [
    {
      "title": "short evocative day title, e.g. 'Arrive & Unwind'",
      "activities": [
        {
          "time": "09:00",
          "title": "activity name with the real place",
          "desc": "one-sentence description (max 18 words)",
          "details": "one practical tip (max 25 words)",
          "duration": "e.g. '2 hrs'",
          "cost": 500,
          "tags": ["nature" | "food" | "culture" | "adventure" | "relax" | "shopping"],
          "optional": false,
          "gem": false,
          "indoor": false,
          "x": 0-100,
          "y": 0-100
        }
      ]
    }
  ]
}`;

function describePrefs(p) {
  const dest = getDestination(p.destinationId);
  const days = tripLength(p);
  const pace = PACES.find((x) => x.id === p.pace);
  const mode = TRAVEL_MODES.find((m) => m.id === p.travelMode);
  return [
    `Destination: ${dest.name} (${dest.region}, ${dest.country})`,
    `Starting city: ${p.startCity}`,
    `Dates: ${p.startDate} to ${p.endDate} (${days} days)`,
    `Travellers: ${p.travellers} (${GROUPS.find((g) => g.id === p.group)?.label})`,
    `Interests: ${p.interests.map((i) => PERSONALITIES.find((x) => x.id === i)?.label).join(', ') || 'open to anything'}`,
    `Total budget for the group: ₹${Math.round(p.budgetLimit)} — comfort level: ${TIERS.find((t) => t.id === p.tier)?.label}`,
    `Pace: ${pace?.label} (about ${pace?.perDay} activities per full day)`,
    mode ? `Preferred way to travel: ${mode.label}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

const pickImage = (a, i, total, dayIndex, days) => {
  if (dayIndex === 0 && i === 0) return 'hotel';
  const t = a.tags[0];
  if (/beach|island|coast/i.test(a.title)) return 'beach';
  if (/temple|pagoda|wat |monastery|stupa|church|mosque/i.test(a.title)) return 'temple';
  if (/fort|palace/i.test(a.title)) return 'fort';
  if (/lake|river|boat|cruise/i.test(a.title)) return 'lake';
  if (/waterfall|falls/i.test(a.title)) return 'waterfall';
  if (/market|bazaar|souk|mall/i.test(a.title)) return 'market';
  if (/museum|gallery/i.test(a.title)) return 'museum';
  if (/desert|dune/i.test(a.title)) return 'desert';
  if (/tea/i.test(a.title)) return 'tea';
  if (dayIndex === days - 1 && i === total - 1) return 'city';
  return { nature: 'viewpoint', food: 'food', culture: 'temple', adventure: 'hike', relax: 'spa', shopping: 'market' }[t] || 'viewpoint';
};

const clamp = (n, lo, hi, d) => (Number.isFinite(Number(n)) ? Math.min(hi, Math.max(lo, Number(n))) : d);

/** Turn a model reply into the app's itinerary shape, defensively. */
function normalizeDays(raw, expectedDays) {
  const days = Array.isArray(raw?.days) ? raw.days.slice(0, expectedDays) : [];
  if (!days.length) throw new Error('No days in AI reply');
  return days.map((d, di) => {
    const list = (Array.isArray(d.activities) ? d.activities : []).slice(0, 6);
    const activities = list.map((a, i) => {
      const tags = (Array.isArray(a.tags) ? a.tags : []).filter((t) => TAGS.includes(t));
      const time = /^\d{1,2}:\d{2}$/.test(a.time || '') ? a.time.padStart(5, '0') : `${String(9 + i * 3).padStart(2, '0')}:00`;
      const hour = Number(time.slice(0, 2));
      const base = {
        id: `ai-${uid()}`,
        uid: uid(),
        title: String(a.title || 'Explore').slice(0, 90),
        desc: String(a.desc || '').slice(0, 200),
        details: String(a.details || 'Check timings locally before you go.').slice(0, 240),
        duration: String(a.duration || '2 hrs').slice(0, 24),
        cost: Math.round(clamp(a.cost, 0, 200000, 0)),
        tags: tags.length ? tags : ['culture'],
        slot: hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening',
        time,
        optional: Boolean(a.optional),
        gem: Boolean(a.gem),
        indoor: Boolean(a.indoor),
        x: clamp(a.x, 2, 98, 20 + ((i * 23 + di * 17) % 60)),
        y: clamp(a.y, 2, 98, 20 + ((i * 31 + di * 13) % 60)),
        favourite: false,
        ai: true,
      };
      return { ...base, image: pickImage(base, i, list.length, di, days.length) };
    });
    if (di === 0 && activities[0]) activities[0].arrival = true;
    if (di === days.length - 1 && days.length > 1 && activities.length) activities[activities.length - 1].departure = true;
    return { id: uid(), variant: 0, title: String(d.title || `Day ${di + 1}`).slice(0, 60), activities: sortByTime(activities) };
  });
}

/** Ask the selected model for a full itinerary. Throws on any failure. */
export async function planWithAI(prefs, settings, signal) {
  const days = tripLength(prefs);
  const prompt = `Plan this trip.\n\n${describePrefs(prefs)}\n\nRules:
- Exactly ${days} day objects. Day 1 starts with arrival and check-in; the last day ends with departure${days === 1 ? ' (same day)' : ''}.
- Match the interests and the pace. Mark nice-to-have items "optional": true and lesser-known spots "gem": true. Mark indoor options "indoor": true.
- Keep the sum of all activity costs × travellers plus stay, food and transport near the group budget.
- "x"/"y" place each stop on a rough schematic map of the destination (0,0 = north-west corner). Nearby places get nearby numbers.

Return JSON in this shape:
${SCHEMA}`;
  const text = await complete(settings, { system: SYSTEM, prompt, signal });
  const parsed = parseJSON(text);
  return {
    ...prefs,
    id: uid(),
    days: normalizeDays(parsed, days),
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    source: settings.provider,
    model: settings.models[settings.provider],
    createdAt: Date.now(),
  };
}

/** Ask the model to adjust an existing itinerary (Journey Companion). */
export async function reviseWithAI(trip, instruction, settings, signal) {
  const days = trip.days.length;
  const current = trip.days.map((d, i) => ({
    day: i + 1,
    date: addDays(trip.startDate, i),
    title: d.title,
    activities: d.activities.map(({ time, title, desc, details, duration, cost, tags, optional, gem, indoor, x, y, favourite }) => ({ time, title, desc, details, duration, cost, tags, optional, gem, indoor, x, y, favourite })),
  }));
  const prompt = `Here is the traveller's current itinerary and preferences.\n\n${describePrefs(trip)}\n\nCurrent plan (JSON):\n${JSON.stringify(current)}\n\nTraveller's request: "${instruction}"

Revise the plan to satisfy the request. Keep activities marked "favourite": true unless the request requires otherwise. Keep exactly ${days} days.
Return JSON in this shape, with "summary" being one friendly sentence explaining what you changed:
${SCHEMA}`;
  const text = await complete(settings, { system: SYSTEM, prompt, signal });
  const parsed = parseJSON(text);
  const nextDays = normalizeDays(parsed, days);
  // carry favourites over by title
  const favs = new Set(trip.days.flatMap((d) => d.activities.filter((a) => a.favourite).map((a) => a.title)));
  nextDays.forEach((d) => d.activities.forEach((a) => (a.favourite = favs.has(a.title))));
  return { trip: { ...trip, days: nextDays }, message: parsed.summary || 'Updated your plan.' };
}
