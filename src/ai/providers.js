/*
 * Thin wrappers around the official Anthropic and Google GenAI SDKs.
 * Both return plain text; aiPlanner.js turns that text into an itinerary.
 *
 * Calls go straight from the browser to the provider with the user's own key.
 * That's fine for a personal demo, but for a public deployment move these
 * calls behind your own server so keys are never shipped to visitors.
 */

// Models that accept server-side refusal fallbacks (`fallbacks: "default"`).
const FALLBACK_MODELS = ['claude-fable-5-1', 'claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5-5'];

export class AIError extends Error {
  constructor(message, { status, provider } = {}) {
    super(message);
    this.status = status;
    this.provider = provider;
  }
}

async function callClaude({ apiKey, model, system, prompt, signal }) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const params = {
    model,
    max_tokens: 16000,
    system,
    messages: [{ role: 'user', content: prompt }],
  };
  try {
    let message;
    if (FALLBACK_MODELS.includes(model)) {
      message = await client.beta.messages
        .stream({ ...params, output_config: { effort: 'medium' }, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }, { signal })
        .finalMessage();
    } else {
      message = await client.messages.stream(params, { signal }).finalMessage();
    }
    if (message.stop_reason === 'refusal') {
      throw new AIError('Claude declined this request. Try rephrasing your preferences.', { provider: 'claude' });
    }
    return message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');
  } catch (err) {
    if (err instanceof AIError) throw err;
    if (err instanceof Anthropic.AuthenticationError) throw new AIError('Your Claude API key was rejected.', { status: 401, provider: 'claude' });
    if (err instanceof Anthropic.NotFoundError) throw new AIError(`Claude model “${model}” was not found.`, { status: 404, provider: 'claude' });
    if (err instanceof Anthropic.RateLimitError) throw new AIError('Claude rate limit reached — try again in a moment.', { status: 429, provider: 'claude' });
    if (err instanceof Anthropic.APIConnectionError) throw new AIError('Could not reach the Claude API. Check your connection.', { provider: 'claude' });
    if (err instanceof Anthropic.APIError) throw new AIError(`Claude API error: ${err.message}`, { status: err.status, provider: 'claude' });
    throw err;
  }
}

async function callGemini({ apiKey, model, system, prompt, signal }) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        temperature: 0.7,
        abortSignal: signal,
      },
    });
    return res.text || '';
  } catch (err) {
    const msg = String(err?.message || err);
    if (/API key|PERMISSION_DENIED|401|403/i.test(msg)) throw new AIError('Your Gemini API key was rejected.', { status: 401, provider: 'gemini' });
    if (/not found|404/i.test(msg)) throw new AIError(`Gemini model “${model}” was not found.`, { status: 404, provider: 'gemini' });
    if (/429|quota|RESOURCE_EXHAUSTED/i.test(msg)) throw new AIError('Gemini quota or rate limit reached.', { status: 429, provider: 'gemini' });
    throw new AIError(`Gemini error: ${msg.slice(0, 160)}`, { provider: 'gemini' });
  }
}

/** Send one prompt to the selected provider and return its text reply. */
export async function complete(settings, { system, prompt, signal }) {
  const { provider } = settings;
  const apiKey = settings.keys?.[provider];
  const model = settings.models?.[provider];
  if (provider === 'demo') throw new AIError('Demo mode — no AI provider selected.');
  if (!apiKey) throw new AIError(`Add a ${provider === 'claude' ? 'Claude' : 'Gemini'} API key in AI settings.`, { provider });
  if (provider === 'claude') return callClaude({ apiKey, model, system, prompt, signal });
  if (provider === 'gemini') return callGemini({ apiKey, model, system, prompt, signal });
  throw new AIError(`Unknown provider “${provider}”.`);
}

/** Extract the first JSON object from a model reply (tolerates code fences). */
export function parseJSON(text) {
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end <= start) throw new AIError('The AI reply did not contain an itinerary.');
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new AIError('The AI reply could not be read as an itinerary.');
  }
}
