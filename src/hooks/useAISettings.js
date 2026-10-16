import { useEffect, useState } from 'react';
import { ENV_DEFAULTS } from '../ai/config';

const KEY = 'atp.ai.v1';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) {
      return {
        provider: saved.provider || ENV_DEFAULTS.provider,
        keys: { ...ENV_DEFAULTS.keys, ...Object.fromEntries(Object.entries(saved.keys || {}).filter(([, v]) => v)) },
        models: { ...ENV_DEFAULTS.models, ...(saved.models || {}) },
      };
    }
  } catch {
    /* ignore */
  }
  return ENV_DEFAULTS;
}

/** AI provider choice, model names and keys — kept in this browser only. */
export function useAISettings() {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const ready = settings.provider !== 'demo' && Boolean(settings.keys[settings.provider]);
  return { settings, setSettings, ready };
}
