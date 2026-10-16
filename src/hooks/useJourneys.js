import { useCallback, useEffect, useState } from 'react';
import { sampleJourneyPrefs } from '../data/journeys';
import { generateItinerary } from '../utils/planner';

const KEY = 'atp.journeys.v2';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* storage unavailable — fall back to samples */
  }
  return sampleJourneyPrefs().map((p) => ({ ...generateItinerary(p), status: p.status, sample: true }));
}

/** Frontend-only saved trips, persisted to localStorage when available. */
export function useJourneys() {
  const [journeys, setJourneys] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(journeys));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [journeys]);

  const save = useCallback((trip, status) => {
    setJourneys((list) => {
      const entry = { ...trip, status, savedAt: Date.now() };
      const exists = list.some((j) => j.id === trip.id);
      return exists ? list.map((j) => (j.id === trip.id ? entry : j)) : [entry, ...list];
    });
  }, []);

  const remove = useCallback((id) => setJourneys((list) => list.filter((j) => j.id !== id)), []);

  const restoreSamples = useCallback(() => {
    setJourneys((list) => {
      const samples = sampleJourneyPrefs().map((p) => ({ ...generateItinerary(p), status: p.status, sample: true }));
      return [...list.filter((j) => !j.sample), ...samples];
    });
  }, []);

  return { journeys, save, remove, restoreSamples };
}
