import { TRAVEL_MODES } from '../data/options';

/**
 * Build an illustrative multi-modal route from a starting city to a destination,
 * using each destination's sample `legs`. Durations are rough guides only.
 */
export function buildRoute(startCity, dest, preferredMode) {
  if (!dest) return [];
  const legs = (dest.legs || [['flight', dest.hub || dest.name, '—']]).map(([mode, to, duration]) => ({ mode, to, duration }));
  // Within India, let the traveller's preferred mode shape the first leg.
  if (dest.country === 'India' && ['flight', 'train', 'bus', 'car'].includes(preferredMode) && legs[0]) {
    legs[0] = { ...legs[0], mode: preferredMode, duration: legs[0].mode === preferredMode ? legs[0].duration : '≈ varies' };
  }
  let from = startCity || 'Your city';
  const out = legs.map((leg) => {
    const step = { ...leg, from, info: TRAVEL_MODES.find((m) => m.id === leg.mode) };
    from = leg.to;
    return step;
  });
  out.push({ mode: 'stay', from, to: 'Hotels & resorts', duration: '' });
  return out;
}
