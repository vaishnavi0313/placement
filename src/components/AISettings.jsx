import { useEffect, useRef, useState } from 'react';
import { FiX, FiEye, FiEyeOff, FiExternalLink, FiCheckCircle, FiAlertCircle, FiLoader, FiShield } from 'react-icons/fi';
import { PROVIDERS } from '../ai/config';
import { complete } from '../ai/providers';
import './AISettings.css';

export default function AISettings({ settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);
  const [show, setShow] = useState(false);
  const [test, setTest] = useState(null);
  const closeRef = useRef(null);
  const p = PROVIDERS[draft.provider];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const set = (patch) => {
    setTest(null);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const runTest = async () => {
    setTest({ state: 'loading' });
    try {
      const reply = await complete(draft, { system: 'Reply with the single word: ready', prompt: 'Connection check.' });
      setTest({ state: 'ok', message: `Connected — ${p.short} replied “${reply.trim().slice(0, 30)}”.` });
    } catch (err) {
      setTest({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ai-title" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ai-panel">
        <button ref={closeRef} className="icon-btn modal__close" onClick={onClose} aria-label="Close AI settings">
          <FiX />
        </button>
        <h2 id="ai-title">AI settings</h2>
        <p className="ai-panel__lead">Choose which AI plans your trips. You can switch any time.</p>

        <div className="ai-providers" role="radiogroup" aria-label="AI provider">
          {Object.values(PROVIDERS).map((x) => (
            <button key={x.id} role="radio" aria-checked={draft.provider === x.id} className={`ai-provider ${draft.provider === x.id ? 'is-active' : ''}`} onClick={() => set({ provider: x.id })}>
              <span className={`ai-provider__logo ai-provider__logo--${x.id}`}>{x.short[0]}</span>
              <strong>{x.label}</strong>
              <small>{x.id === 'demo' ? 'Offline sample data' : draft.keys[x.id] ? 'Key added' : 'Needs an API key'}</small>
            </button>
          ))}
        </div>

        {draft.provider === 'demo' ? (
          <p className="ai-panel__note">{PROVIDERS.demo.note}</p>
        ) : (
          <div className="ai-fields">
            <label className="field">
              <span className="field__label">Model</span>
              <input className="input" list={`models-${p.id}`} value={draft.models[p.id]} onChange={(e) => set({ models: { ...draft.models, [p.id]: e.target.value.trim() } })} />
              <datalist id={`models-${p.id}`}>
                {p.models.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <small className="ai-fields__hint">Pick a suggestion or type any model name your key can use.</small>
            </label>
            <label className="field">
              <span className="field__label">{p.short} API key</span>
              <span className="ai-key">
                <input
                  className="input"
                  type={show ? 'text' : 'password'}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder={p.keyHint}
                  value={draft.keys[p.id]}
                  onChange={(e) => set({ keys: { ...draft.keys, [p.id]: e.target.value.trim() } })}
                />
                <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide key' : 'Show key'}>
                  {show ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
              <a className="ai-fields__link" href={p.keyUrl} target="_blank" rel="noreferrer">
                Get a {p.short} key <FiExternalLink />
              </a>
            </label>
            <div className="ai-test">
              <button className="btn btn-ghost btn-sm" onClick={runTest} disabled={!draft.keys[p.id] || test?.state === 'loading'}>
                {test?.state === 'loading' ? <FiLoader className="spin" /> : <FiCheckCircle />} Test connection
              </button>
              {test && test.state !== 'loading' && (
                <span className={`ai-test__msg is-${test.state}`}>
                  {test.state === 'ok' ? <FiCheckCircle /> : <FiAlertCircle />} {test.message}
                </span>
              )}
            </div>
            <p className="note">
              <FiShield /> Your key is stored only in this browser and sent directly to {p.short}. For a public website, route AI calls through your own server instead.
            </p>
          </div>
        )}

        <div className="ai-panel__actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
