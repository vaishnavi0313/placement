/*
 * ─────────────────────────────────────────────────────────────────────────
 *  OFFLINE SAMPLE PLANNER — used in Demo mode and as the fallback whenever
 *  Claude/Gemini is not configured or a request fails (see ai/aiPlanner.js).
 *  Itineraries are assembled deterministically from the activity pools in
 *  data/destinations.js, scored against the traveller's interests and pace.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { getDestination } from '../data/destinations';
import { PACES, TIERS, TRAVEL_MODES, TRIP_TYPES } from '../data/options';
import { daysBetween, uid } from './format';

const SLOT_ORDER = { morning: 0, afternoon: 1, evening: 2 };
const MAX_DAYS = 10;

const DAY_TITLES = {
  nature: ['Nature & Discovery', 'Forests, Lakes & Lookouts', 'Into the Wild Side'],
  food: ['Flavours & Local Life', 'A Day for the Taste Buds', 'Kitchens & Corner Cafés'],
  culture: ['Heritage & Stories', 'Old Streets, Old Souls', 'Living Traditions'],
  adventure: ['Trails & Thrills', 'Higher, Further, Earlier', 'The Adventurous Day'],
  relax: ['Slow Days & Soft Light', 'Unhurried Wandering', 'Breathe Out'],
  shopping: ['Markets & Makers', 'Bazaars & Souvenirs', 'Hunting for Treasures'],
};

export const tripLength = (trip) => Math.min(Math.max(daysBetween(trip.startDate, trip.endDate), 1), MAX_DAYS);

function score(activity, interests) {
  const hits = activity.tags.filter((t) => interests.includes(t)).length;
  return hits * 2 + (activity.gem ? 0.4 : 0) - (activity.optional ? 0.3 : 0);
}

const instance = (a) => ({ ...a, uid: uid(), favourite: false });

export const sortByTime = (list) =>
  [...list].sort((a, b) => a.time.localeCompare(b.time) || SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]);

/** After a manual reorder, keep the day's time slots in sequence. */
export function retime(list) {
  const times = list.map((a) => a.time).sort();
  return list.map((a, i) => ({ ...a, time: times[i] }));
}

const leisure = (dayIndex) =>
  instance({
    id: `leisure-${dayIndex}-${uid()}`,
    title: 'Free time to wander',
    desc: 'An open window to revisit a favourite spot or simply rest.',
    details: 'Unplanned time keeps a trip enjoyable — use it however the day feels.',
    tags: ['relax'],
    slot: 'afternoon',
    time: '15:00',
    duration: 'Flexible',
    cost: 0,
    x: 50,
    y: 50,
    image: 'cafe',
    leisure: true,
  });

function titleDays(days, total) {
  const used = {};
  return days.map((day, i) => {
    if (i === 0) return { ...day, title: 'Arrive & Unwind' };
    if (i === total - 1 && total > 1) return { ...day, title: 'Slow Morning & Departure' };
    const counts = {};
    day.activities.forEach((a) => a.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'relax';
    const n = used[top] || 0;
    used[top] = n + 1;
    return { ...day, title: DAY_TITLES[top][n % DAY_TITLES[top].length] };
  });
}

const fixedCount = (day) => day.activities.filter((a) => a.arrival || a.departure).length;

/** Build a complete mock itinerary from builder preferences. */
export function generateItinerary(prefs) {
  const dest = getDestination(prefs.destinationId);
  const total = tripLength(prefs);
  const perDay = PACES.find((p) => p.id === prefs.pace)?.perDay || 3;
  const interests = prefs.interests.length ? prefs.interests : ['nature', 'culture'];

  const arrival = dest.activities.find((a) => a.arrival);
  const departure = dest.activities.find((a) => a.departure);
  const pool = dest.activities
    .filter((a) => !a.arrival && !a.departure)
    .map((a, i) => ({ a, s: score(a, interests), i }))
    .sort((x, y) => y.s - x.s || x.i - y.i)
    .map((x) => x.a);

  const days = [];
  for (let d = 0; d < total; d += 1) {
    const isFirst = d === 0;
    const isLast = d === total - 1 && total > 1;
    let slots = perDay;
    const fixed = [];
    if (isFirst) {
      fixed.push(instance(arrival));
      slots = Math.max(1, perDay - 1);
    }
    if (isLast) {
      fixed.push(instance(departure));
      slots = Math.max(0, perDay - 2);
    }
    // Arrival days favour afternoon/evening plans; departure days favour mornings.
    const fits = (a) => (isFirst ? a.slot !== 'morning' : isLast ? a.slot === 'morning' : true);
    const chosen = [];
    for (let k = 0; k < pool.length && chosen.length < slots; k += 1) {
      if (fits(pool[k])) chosen.push(...pool.splice(k--, 1));
    }
    while (chosen.length < slots && pool.length) chosen.push(pool.shift());
    const acts = chosen.map(instance);
    if (!acts.length && !fixed.length) acts.push(leisure(d));
    days.push({ id: uid(), variant: 0, activities: sortByTime([...fixed, ...acts]) });
  }

  return {
    ...prefs,
    id: uid(),
    days: titleDays(days, total),
    createdAt: Date.now(),
  };
}

const usedIds = (trip, exceptDay = -1) =>
  new Set(trip.days.flatMap((d, i) => (i === exceptDay ? [] : d.activities.map((a) => a.id))));

/** Activities from the destination pool that are not in the itinerary yet. */
export function recommendations(trip, filter = () => true) {
  const dest = getDestination(trip.destinationId);
  const used = usedIds(trip);
  return dest.activities.filter((a) => !a.arrival && !a.departure && !used.has(a.id) && filter(a));
}

/** Swap one day for a predefined alternative drawn from the unused pool. */
export function regenerateDay(trip, dayIndex) {
  const dest = getDestination(trip.destinationId);
  const day = trip.days[dayIndex];
  const fixed = day.activities.filter((a) => a.arrival || a.departure);
  const current = day.activities.filter((a) => !a.arrival && !a.departure && !a.leisure);
  const want = Math.max(current.length, 1);
  const taken = usedIds(trip, dayIndex);
  const candidates = dest.activities.filter((a) => !a.arrival && !a.departure && !taken.has(a.id));
  if (candidates.length <= want && candidates.every((c) => current.some((a) => a.id === c.id))) {
    return { trip, changed: false };
  }
  const variant = (day.variant || 0) + 1;
  const offset = (variant * want) % candidates.length;
  const rotated = [...candidates.slice(offset), ...candidates.slice(0, offset)];
  // Prefer activities not already on this day so the swap is visible.
  const fresh = rotated.filter((a) => !current.some((c) => c.id === a.id));
  const picked = [...fresh, ...rotated].slice(0, want);
  const days = trip.days.map((d, i) =>
    i === dayIndex ? { ...d, variant, activities: sortByTime([...fixed, ...picked.map(instance)]) } : d,
  );
  return { trip: { ...trip, days: titleDays(days, days.length) }, changed: true };
}

export function addActivity(trip, dayIndex, activity) {
  const days = trip.days.map((d, i) =>
    i === dayIndex
      ? { ...d, activities: sortByTime([...d.activities.filter((a) => !a.leisure), instance(activity)]) }
      : d,
  );
  return { ...trip, days };
}

export function updateDay(trip, dayIndex, fn) {
  return { ...trip, days: trip.days.map((d, i) => (i === dayIndex ? { ...d, activities: fn(d.activities) } : d)) };
}

/* ── Budget ──────────────────────────────────────────────────────────── */

export const BUDGET_CATEGORIES = [
  { id: 'transport', label: 'Transport', color: '#10243A' },
  { id: 'accommodation', label: 'Accommodation', color: '#0D9488' },
  { id: 'food', label: 'Food', color: '#F28C75' },
  { id: 'activities', label: 'Activities', color: '#E0A43B' },
  { id: 'local', label: 'Local travel', color: '#6FA8C7' },
  { id: 'contingency', label: 'Contingency', color: '#B9B3A6' },
];

/** All amounts are illustrative INR estimates derived from mock data. */
export function computeBudget(trip, { activitiesTotal } = {}) {
  const dest = getDestination(trip.destinationId);
  if (!dest) return null;
  const days = tripLength(trip);
  const nights = Math.max(1, days - 1);
  const people = Math.max(1, trip.travellers || 1);
  const tier = TIERS.find((t) => t.id === trip.tier) || TIERS[1];
  const near = dest.nearby.includes(trip.startCity);
  const transportTier = { budget: 0.85, balanced: 1, comfort: 1.3 }[tier.id];
  const domestic = dest.country === 'India';
  const modeFactor = domestic ? TRAVEL_MODES.find((m) => m.id === trip.travelMode)?.factor ?? 1 : 1;
  const tripFactor = TRIP_TYPES.find((t) => t.id === trip.tripType)?.factor ?? 1;

  const perPersonActivities =
    activitiesTotal ??
    (trip.days ? trip.days.reduce((s, d) => s + d.activities.reduce((x, a) => x + a.cost, 0), 0) : estimateActivities(dest, trip, days));

  const parts = {
    transport: dest.costs.transport * (near ? 0.7 : 1) * transportTier * modeFactor * tripFactor * people,
    accommodation: dest.costs.stay[tier.id] * nights * Math.ceil(people / 2),
    food: dest.costs.food * tier.factor * people * days,
    activities: perPersonActivities * people,
    local: dest.costs.local * tier.factor * days * Math.ceil(people / 4),
  };
  const subtotal = Object.values(parts).reduce((a, b) => a + b, 0);
  parts.contingency = subtotal * 0.08;
  Object.keys(parts).forEach((k) => (parts[k] = Math.round(parts[k] / 10) * 10));
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  return { parts, total, perPerson: Math.round(total / people), days, nights, people };
}

function estimateActivities(dest, trip, days) {
  const perDay = PACES.find((p) => p.id === trip.pace)?.perDay || 3;
  const pool = dest.activities.filter((a) => !a.arrival && !a.departure);
  const avg = pool.reduce((s, a) => s + a.cost, 0) / pool.length;
  return avg * Math.min(pool.length, perDay * days * 0.8);
}

/* ── Journey Companion — predefined adjustments, no AI involved ───────── */

const tierDown = { comfort: 'balanced', balanced: 'budget', budget: 'budget' };

export function applyCompanion(trip, chipId) {
  const dest = getDestination(trip.destinationId);
  switch (chipId) {
    case 'cheaper': {
      const removed = [];
      const days = trip.days.map((d) => {
        const optional = d.activities.filter((a) => a.optional && a.cost > 0).sort((a, b) => b.cost - a.cost)[0];
        if (!optional) return d;
        removed.push(optional.title);
        return { ...d, activities: d.activities.filter((a) => a.uid !== optional.uid) };
      });
      const tier = tierDown[trip.tier];
      if (!removed.length && tier === trip.tier) {
        return { trip, message: 'Your plan is already as lean as it gets — budget stays and no paid optional extras remain.' };
      }
      const bits = [];
      if (tier !== trip.tier) bits.push(`switched stays to the ${tier} tier`);
      if (removed.length) bits.push(`dropped ${removed.length} paid optional ${removed.length > 1 ? 'activities' : 'activity'} (${removed.join(', ')})`);
      return { trip: { ...trip, tier, days }, message: `I ${bits.join(' and ')}.` };
    }
    case 'gems': {
      const gems = recommendations(trip, (a) => a.gem).slice(0, 2);
      if (!gems.length) return { trip, message: `Every hidden gem we know of in ${dest.name} is already in your plan.` };
      let next = trip;
      gems.forEach((g) => {
        const target = leastBusyDay(next);
        next = addActivity(next, target, g);
      });
      return { trip: next, message: `Added ${gems.map((g) => g.title).join(' and ')} — quieter spots most visitors miss.` };
    }
    case 'relaxed': {
      const removed = [];
      const days = trip.days.map((d) => {
        const cap = fixedCount(d) ? 1 : 2;
        const free = d.activities.filter((a) => !a.arrival && !a.departure);
        if (free.length <= cap) return d;
        const ranked = [...free].sort((a, b) => Number(b.favourite) - Number(a.favourite) || Number(a.optional) - Number(b.optional));
        const keep = new Set(ranked.slice(0, cap).map((a) => a.uid));
        free.filter((a) => !keep.has(a.uid)).forEach((a) => removed.push(a.title));
        return { ...d, activities: d.activities.filter((a) => a.arrival || a.departure || keep.has(a.uid)) };
      });
      if (!removed.length) return { trip, message: 'Your days are already nicely unhurried — nothing to trim.' };
      return {
        trip: { ...trip, pace: 'relaxed', days },
        message: `Trimmed ${removed.length} ${removed.length > 1 ? 'activities' : 'activity'} so every day has breathing room. Favourites were kept.`,
      };
    }
    case 'food': {
      const picks = recommendations(trip, (a) => a.tags.includes('food')).slice(0, 2);
      if (!picks.length) return { trip, message: `All the food experiences in our ${dest.name} collection are already on your plan — bon appétit!` };
      let next = trip;
      picks.forEach((p) => (next = addActivity(next, leastBusyDay(next), p)));
      return { trip: next, message: `Added ${picks.map((p) => p.title).join(' and ')} for more local flavour.` };
    }
    case 'rainy': {
      const indoor = dest.activities.filter((a) => a.indoor && !a.arrival && !a.departure);
      return {
        trip,
        message: `If the weather turns, these indoor plans in ${dest.name} work well. Add any of them to a day:`,
        suggestions: indoor,
      };
    }
    default:
      return { trip, message: '' };
  }
}

function leastBusyDay(trip) {
  const last = trip.days.length - 1;
  let best = 0;
  let min = Infinity;
  trip.days.forEach((d, i) => {
    const weight = d.activities.length + (i === 0 || (i === last && last > 0) ? 0.5 : 0);
    if (weight < min) {
      min = weight;
      best = i;
    }
  });
  return best;
}

/** Indicative per-person cost for a 3-day, balanced trip for two — used on cards. */
export function indicativePerPerson(dest, days = 3) {
  const start = '2026-01-01';
  const end = new Date(Date.UTC(2026, 0, days)).toISOString().slice(0, 10);
  const b = computeBudget({ destinationId: dest.id, startCity: dest.nearby[0], startDate: start, endDate: end, travellers: 2, tier: 'balanced', pace: 'balanced' });
  return b.perPerson;
}
