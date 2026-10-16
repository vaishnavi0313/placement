import { CURRENCIES } from '../data/options';

export const getCurrency = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

/** Convert an INR amount to the chosen currency and format it. */
export function money(inr, code = 'INR', { compact = false } = {}) {
  const cur = getCurrency(code);
  const value = inr * cur.rate;
  const rounded = code === 'INR' ? Math.round(value / 10) * 10 : Math.round(value);
  if (compact && code === 'INR' && rounded >= 100000) {
    return `${cur.symbol}${(rounded / 100000).toFixed(rounded >= 1000000 ? 0 : 1)}L`;
  }
  if (compact && rounded >= 10000) {
    return `${cur.symbol}${Math.round(rounded / 1000)}k`;
  }
  return `${cur.symbol}${rounded.toLocaleString(cur.locale)}`;
}

/** Convert an amount in the chosen currency back to INR. */
export const toINR = (amount, code) => amount / getCurrency(code).rate;
export const fromINR = (inr, code) => inr * getCurrency(code).rate;

const pad = (n) => String(n).padStart(2, '0');
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

export function daysBetween(startIso, endIso) {
  if (!startIso || !endIso) return 0;
  const a = new Date(`${startIso}T00:00:00`);
  const b = new Date(`${endIso}T00:00:00`);
  return Math.round((b - a) / 86400000) + 1;
}

export function prettyDate(iso, opts = { day: 'numeric', month: 'short' }) {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', opts);
}

export const dateRange = (start, end) =>
  `${prettyDate(start)} – ${prettyDate(end, { day: 'numeric', month: 'short', year: 'numeric' })}`;

export const today = () => isoDate(new Date());

export const uid = () => Math.random().toString(36).slice(2, 10);
