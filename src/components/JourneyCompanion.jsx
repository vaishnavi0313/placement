import { useState } from 'react';
import { FiPlus, FiRotateCcw, FiX, FiCheck, FiSend, FiLoader } from 'react-icons/fi';
import { COMPANION_CHIPS } from '../data/options';
import { money } from '../utils/format';
import './JourneyCompanion.css';

/**
 * Journey Companion — with Claude/Gemini connected, chips and free-text
 * requests are sent to the model; in Demo mode each chip applies a predefined
 * adjustment from utils/planner.js (applyCompanion).
 */
export default function JourneyCompanion({ state, onChip, onAsk, aiReady, aiLabel, onDismiss, onUndo, currency, days, onAddSuggestion, usedIds }) {
  const [targetDay, setTargetDay] = useState(0);
  const [text, setText] = useState('');
  const busy = Boolean(state?.loading);

  return (
    <section className="companion" aria-labelledby="companion-title">
      <header className="companion__head">
        <span className="companion__avatar" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="22" height="22">
            <path d="M4 22c6-10 12-2 24-14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="1 4" />
            <circle cx="28" cy="8" r="3" fill="currentColor" />
          </svg>
        </span>
        <div>
          <h3 id="companion-title">Your Journey Companion</h3>
          <p>{aiReady ? `Powered by ${aiLabel}` : 'Quick ways to reshape the plan'}</p>
        </div>
      </header>

      <div className="companion__chips">
        {COMPANION_CHIPS.map((c) => (
          <button key={c.id} disabled={busy} className={`companion__chip ${state?.chipId === c.id ? 'is-active' : ''}`} onClick={() => onChip(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {aiReady && (
        <form
          className="companion__ask"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim() && !busy) {
              onAsk(text.trim());
              setText('');
            }
          }}
        >
          <label className="sr-only" htmlFor="companion-input">
            Ask the companion to change your plan
          </label>
          <input id="companion-input" placeholder="e.g. Add a sunrise spot on day 2" value={text} onChange={(e) => setText(e.target.value)} disabled={busy} maxLength={240} />
          <button className="icon-btn" aria-label="Send request" disabled={!text.trim() || busy}>
            <FiSend />
          </button>
        </form>
      )}

      <div className="companion__feed" aria-live="polite">
        {!state ? (
          <p className="companion__idle">{aiReady ? 'Tap a suggestion or type a request — every change can be undone.' : 'Tap a suggestion above — changes apply instantly and can be undone.'}</p>
        ) : state.loading ? (
          <div className="companion__reply">
            <p className="companion__you">{state.label}</p>
            <div className="companion__bubble companion__thinking">
              <FiLoader className="spin" /> {aiLabel} is reworking your plan…
            </div>
          </div>
        ) : (
          <div className="companion__reply" key={`${state.chipId}-${state.message}`}>
            <p className="companion__you">{state.label}</p>
            <div className="companion__bubble">
              <p>{state.message}</p>
              {typeof state.delta === 'number' && state.delta !== 0 && (
                <p className={`companion__delta ${state.delta < 0 ? 'is-saving' : ''}`}>
                  {state.delta < 0 ? `Saves about ${money(-state.delta, currency)}` : `Adds about ${money(state.delta, currency)}`} to the estimate
                </p>
              )}
              {state.suggestions && (
                <>
                  <label className="companion__day">
                    Add to
                    <select value={targetDay} onChange={(e) => setTargetDay(Number(e.target.value))}>
                      {days.map((d, i) => (
                        <option key={d.id} value={i}>
                          Day {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ul className="companion__suggestions">
                    {state.suggestions.map((s) => {
                      const added = usedIds.has(s.id);
                      return (
                        <li key={s.id}>
                          <span>
                            <strong>{s.title}</strong>
                            <small>{s.duration}</small>
                          </span>
                          <button className="icon-btn" disabled={added} aria-label={added ? `${s.title} is in your plan` : `Add ${s.title} to Day ${targetDay + 1}`} onClick={() => onAddSuggestion(targetDay, s)}>
                            {added ? <FiCheck /> : <FiPlus />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              <div className="companion__actions">
                {onUndo && typeof state.delta === 'number' && (
                  <button className="btn btn-ghost btn-sm" onClick={onUndo}>
                    <FiRotateCcw /> Undo
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={onDismiss}>
                  <FiX /> Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="companion__foot">Suggestions can be wrong — check details before you book.</p>
    </section>
  );
}
