// Switchable AI providers. The planner works without any of them (Demo mode
// uses local sample data); add a key in the app's AI settings or in `.env`.

export const PROVIDERS = {
  demo: {
    id: 'demo',
    label: 'Demo (offline)',
    short: 'Demo',
    note: 'Uses built-in sample itineraries. No key or internet needed.',
  },
  claude: {
    id: 'claude',
    label: 'Claude (Anthropic)',
    short: 'Claude',
    defaultModel: 'claude-opus-5-5',
    models: ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-fable-5-1'],
    keyHint: 'sk-ant-…',
    keyUrl: 'https://platform.claude.com/settings/keys',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini (Google)',
    short: 'Gemini',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'],
    keyHint: 'AIza…',
    keyUrl: 'https://aistudio.google.com/apikey',
  },
};

const env = import.meta.env;

/** Defaults can come from .env (see .env.example); the in-app settings override them. */
export const ENV_DEFAULTS = {
  provider: env.VITE_AI_PROVIDER || (env.VITE_ANTHROPIC_API_KEY ? 'claude' : env.VITE_GEMINI_API_KEY ? 'gemini' : 'demo'),
  keys: {
    claude: env.VITE_ANTHROPIC_API_KEY || '',
    gemini: env.VITE_GEMINI_API_KEY || '',
  },
  models: {
    claude: env.VITE_CLAUDE_MODEL || PROVIDERS.claude.defaultModel,
    gemini: env.VITE_GEMINI_MODEL || PROVIDERS.gemini.defaultModel,
  },
};
