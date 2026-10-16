import { useMemo, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiMinus, FiPlus, FiAlertCircle, FiMapPin, FiZap, FiInfo, FiCpu } from 'react-icons/fi';
import { DESTINATIONS, STARTING_CITIES, getDestination } from '../data/destinations';
import { CURRENCIES, DURATIONS, GROUPS, PACES, PERSONALITIES, TIERS, TRAVEL_MODES, TRIP_TYPES } from '../data/options';
import { addDays, daysBetween, dateRange, fromINR, getCurrency, money, toINR, today } from '../utils/format';
import { computeBudget } from '../utils/planner';
import SmartImage from './SmartImage';
import './TripBuilder.css';

const STEPS = [
  { id: 'where', label: 'Where to?', short: 'Where' },
  { id: 'when', label: 'When are you travelling?', short: 'When' },
  { id: 'who', label: 'Who is travelling?', short: 'Who' },
  { id: 'style', label: 'What is your travel personality?', short: 'Style' },
  { id: 'budget', label: 'Set your budget', short: 'Budget' },
  { id: 'pace', label: 'Choose your pace', short: 'Pace' },
];

export function validateStep(i, p) {
  switch (i) {
    case 0:
      if (!p.destinationId) return 'Choose a destination — or let us suggest one.';
      if (!p.startCity) return 'Tell us where you’re starting from.';
      return '';
    case 1: {
      if (!p.startDate || !p.endDate) return 'Pick both a start and an end date.';
      if (p.startDate < today()) return 'Your start date is in the past.';
      const n = daysBetween(p.startDate, p.endDate);
      if (n < 1) return 'The end date must be on or after the start date.';
      if (n > 10) return 'This prototype plans trips of up to 10 days.';
      return '';
    }
    case 2:
      return p.travellers >= 1 ? '' : 'Add at least one traveller.';
    case 3:
      return p.interests.length ? '' : 'Pick at least one thing you love doing.';
    case 4:
      return p.budgetLimit > 0 ? '' : 'Set a budget greater than zero.';
    case 5:
      return p.pace ? '' : 'Choose a pace.';
    default:
      return '';
  }
}

export default function TripBuilder({ prefs, setPrefs, step, setStep, mood, onCreate, aiLong, onOpenAI }) {
  const [error, setError] = useState('');
  const set = (patch) => {
    setError('');
    setPrefs((p) => ({ ...p, ...patch }));
  };

  const go = (target) => {
    if (target > step) {
      for (let i = step; i < target; i += 1) {
        const msg = validateStep(i, prefs);
        if (msg) {
          setStep(i);
          setError(msg);
          return;
        }
      }
    }
    setError('');
    setStep(target);
  };

  const create = () => {
    for (let i = 0; i < STEPS.length; i += 1) {
      const msg = validateStep(i, prefs);
      if (msg) {
        setStep(i);
        setError(msg);
        return;
      }
    }
    onCreate();
  };

  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <section className="section builder" id="plan">
      <div className="container">
        <header className="builder__head">
          <span className="eyebrow">Travel Planner</span>
          <h2 className="section-title">Six quick questions. One trip that feels like yours.</h2>
          <p className="section-lead">Answer at your own pace — your choices stay put as you move between steps.</p>
          {aiLong && (
            <button className="builder__ai" onClick={onOpenAI}>
              <FiCpu /> Itineraries by <strong>{aiLong}</strong> · change
            </button>
          )}
        </header>

        <div className="builder__grid">
          <div className="builder__panel">
            <ol className="steps" aria-label="Trip builder progress">
              {STEPS.map((s, i) => (
                <li key={s.id} className={`${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
                  <button onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                    <span className="steps__dot">{i < step ? <FiCheck /> : i + 1}</span>
                    <span className="steps__label">{s.short}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="steps__bar" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="builder__step" key={step}>
              <p className="builder__count">
                Step {step + 1} of {STEPS.length}
              </p>
              <h3 className="builder__q">{STEPS[step].label}</h3>
              {step === 0 && <StepWhere prefs={prefs} set={set} mood={mood} />}
              {step === 1 && <StepWhen prefs={prefs} set={set} />}
              {step === 2 && <StepWho prefs={prefs} set={set} />}
              {step === 3 && <StepStyle prefs={prefs} set={set} />}
              {step === 4 && <StepBudget prefs={prefs} set={set} />}
              {step === 5 && <StepPace prefs={prefs} set={set} />}
            </div>

            {error && (
              <p className="builder__error" role="alert">
                <FiAlertCircle /> {error}
              </p>
            )}

            <div className="builder__nav">
              <button className="btn btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
                <FiArrowLeft /> Back
              </button>
              {isLast ? (
                <button className="btn btn-primary" onClick={create}>
                  <FiZap /> Create My Itinerary
                </button>
              ) : (
                <button className="btn btn-dark" onClick={() => go(step + 1)}>
                  Continue <FiArrowRight />
                </button>
              )}
            </div>
          </div>

          <Summary prefs={prefs} step={step} go={go} />
        </div>
      </div>
    </section>
  );
}

/* ── Steps ───────────────────────────────────────────────────────────── */

function StepWhere({ prefs, set, mood }) {
  const suggestions = useMemo(() => {
    const wants = prefs.interests.length ? prefs.interests : mood.interests;
    return [...DESTINATIONS]
      .map((d) => ({ d, s: d.activities.filter((a) => a.tags.some((t) => wants.includes(t))).length + (d.moods.includes(mood.id) ? 4 : 0) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.d);
  }, [prefs.interests, mood]);

  return (
    <div className="stack">
      <div className="field">
        <span className="field__label">Destination</span>
        <div className="dest-pick" role="radiogroup" aria-label="Destination">
          {DESTINATIONS.map((d) => (
            <button key={d.id} role="radio" aria-checked={prefs.destinationId === d.id} className={`dest-pick__item ${prefs.destinationId === d.id ? 'is-active' : ''}`} onClick={() => set({ destinationId: d.id, flexible: false })}>
              <SmartImage src={d.image} alt="" className="dest-pick__img" />
              <span>{d.name}</span>
              {prefs.destinationId === d.id && <FiCheck className="dest-pick__check" />}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-discover ${prefs.flexible ? 'is-open' : ''}`}>
        <label className="toggle">
          <input type="checkbox" checked={prefs.flexible} onChange={(e) => set({ flexible: e.target.checked })} />
          <span className="toggle__track" aria-hidden="true" />
          <span>
            <strong>I’m flexible</strong> — suggest somewhere for my {mood.label.toLowerCase()} mood
          </span>
        </label>
        {prefs.flexible && (
          <ul className="flex-discover__list">
            {suggestions.map((d) => (
              <li key={d.id}>
                <button className={prefs.destinationId === d.id ? 'is-active' : ''} onClick={() => set({ destinationId: d.id })}>
                  <SmartImage src={d.image} alt="" className="flex-discover__img" />
                  <span>
                    <strong>{d.name}</strong>
                    <small>{d.tagline}</small>
                  </span>
                  {prefs.destinationId === d.id ? <FiCheck /> : <FiPlus />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="field">
        <span className="field__label">How do you want to travel?</span>
        <div className="chips">
          {TRIP_TYPES.map((t) => (
            <button key={t.id} className={`chip ${prefs.tripType === t.id ? 'is-active' : ''}`} aria-pressed={prefs.tripType === t.id} onClick={() => set({ tripType: t.id })}>
              {t.label}
            </button>
          ))}
          <span className="chips__sep" aria-hidden="true" />
          {TRAVEL_MODES.filter((m) => ['flight', 'train', 'bus', 'car'].includes(m.id)).map((m) => {
            const Icon = m.icon;
            return (
              <button key={m.id} className={`chip ${prefs.travelMode === m.id ? 'is-active' : ''}`} aria-pressed={prefs.travelMode === m.id} onClick={() => set({ travelMode: m.id })}>
                <Icon aria-hidden="true" /> {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="field">
        <span className="field__label">
          <FiMapPin /> Starting from
        </span>
        <select value={prefs.startCity} onChange={(e) => set({ startCity: e.target.value })} className="input">
          <option value="">Select your city</option>
          {STARTING_CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

function StepWhen({ prefs, set }) {
  const n = daysBetween(prefs.startDate, prefs.endDate);
  const applyDuration = (dur) => set({ duration: dur.id, endDate: addDays(prefs.startDate || today(), dur.days - 1) });

  return (
    <div className="stack">
      <div className="field-row">
        <label className="field">
          <span className="field__label">Start date</span>
          <input
            type="date"
            className="input"
            min={today()}
            value={prefs.startDate}
            onChange={(e) => {
              const start = e.target.value;
              const len = Math.max(daysBetween(prefs.startDate, prefs.endDate), 1);
              set({ startDate: start, endDate: start ? addDays(start, len - 1) : prefs.endDate });
            }}
          />
        </label>
        <label className="field">
          <span className="field__label">End date</span>
          <input type="date" className="input" min={prefs.startDate || today()} value={prefs.endDate} onChange={(e) => set({ endDate: e.target.value, duration: '' })} />
        </label>
      </div>
      <div className="field">
        <span className="field__label">Or pick a flexible duration</span>
        <div className="chips">
          {DURATIONS.map((d) => (
            <button key={d.id} className={`chip ${prefs.duration === d.id && n === d.days ? 'is-active' : ''}`} onClick={() => applyDuration(d)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      {n > 0 && (
        <div className="calendar-strip" aria-hidden="true">
          {Array.from({ length: Math.min(n, 10) }, (_, i) => (
            <span key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <small>Day</small>
              {i + 1}
            </span>
          ))}
        </div>
      )}
      <p className="builder__hint">
        {n > 0 ? `${n} ${n === 1 ? 'day' : 'days'}, ${Math.max(n - 1, 0)} ${n - 1 === 1 ? 'night' : 'nights'} · ${dateRange(prefs.startDate, prefs.endDate)}` : 'Choose your dates to see the trip length.'}
      </p>
    </div>
  );
}

function StepWho({ prefs, set }) {
  const group = GROUPS.find((g) => g.id === prefs.group) || GROUPS[0];
  const change = (delta) => set({ travellers: Math.min(group.max, Math.max(group.min, prefs.travellers + delta)) });

  return (
    <div className="stack">
      <div className="tiles tiles--4" role="radiogroup" aria-label="Travel group">
        {GROUPS.map((g) => (
          <button key={g.id} role="radio" aria-checked={prefs.group === g.id} className={`tile ${prefs.group === g.id ? 'is-active' : ''}`} onClick={() => set({ group: g.id, travellers: g.default })}>
            <span className="tile__people" aria-hidden="true">
              {Array.from({ length: Math.min(g.default, 4) }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <strong>{g.label}</strong>
            <small>{g.hint}</small>
          </button>
        ))}
      </div>
      <div className="stepper">
        <span className="field__label">Number of travellers</span>
        <div className="stepper__ctrl">
          <button className="icon-btn" onClick={() => change(-1)} disabled={prefs.travellers <= group.min} aria-label="Remove a traveller">
            <FiMinus />
          </button>
          <output aria-live="polite">{prefs.travellers}</output>
          <button className="icon-btn" onClick={() => change(1)} disabled={prefs.travellers >= group.max} aria-label="Add a traveller">
            <FiPlus />
          </button>
        </div>
        {group.min === group.max && <small className="builder__hint">Fixed for {group.label.toLowerCase()} trips.</small>}
      </div>
    </div>
  );
}

function StepStyle({ prefs, set }) {
  const toggle = (id) => set({ interests: prefs.interests.includes(id) ? prefs.interests.filter((x) => x !== id) : [...prefs.interests, id] });
  return (
    <div className="stack">
      <p className="builder__hint">Pick as many as you like — we’ll weave them through every day.</p>
      <div className="tiles tiles--3">
        {PERSONALITIES.map((p) => {
          const Icon = p.icon;
          const on = prefs.interests.includes(p.id);
          return (
            <button key={p.id} className={`tile tile--icon ${on ? 'is-active' : ''}`} aria-pressed={on} onClick={() => toggle(p.id)}>
              <Icon className="tile__icon" aria-hidden="true" />
              <strong>{p.label}</strong>
              {on && <FiCheck className="tile__check" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBudget({ prefs, set }) {
  const cur = getCurrency(prefs.currency);
  const value = Math.round(fromINR(prefs.budgetLimit, cur.code) / cur.step) * cur.step;
  const estimate = prefs.destinationId ? computeBudget(prefs) : null;
  const pct = (value / cur.max) * 100;

  return (
    <div className="stack">
      <div className="budget-input">
        <div className="budget-input__top">
          <output className="budget-input__value">{money(prefs.budgetLimit, cur.code)}</output>
          <label className="budget-input__cur">
            <span className="sr-only">Currency</span>
            <select className="input input--sm" value={prefs.currency} onChange={(e) => set({ currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="sr-only" htmlFor="budget-range">
          Total trip budget
        </label>
        <input
          id="budget-range"
          type="range"
          className="range"
          min={cur.step}
          max={cur.max}
          step={cur.step}
          value={value}
          style={{ '--pct': `${pct}%` }}
          onChange={(e) => set({ budgetLimit: Math.round(toINR(Number(e.target.value), cur.code)) })}
        />
        <div className="range__scale">
          <span>{money(toINR(cur.step, cur.code), cur.code)}</span>
          <span>Total for the whole group</span>
          <span>{money(toINR(cur.max, cur.code), cur.code)}</span>
        </div>
      </div>

      <div className="tiles tiles--3" role="radiogroup" aria-label="Comfort level">
        {TIERS.map((t) => (
          <button key={t.id} role="radio" aria-checked={prefs.tier === t.id} className={`tile ${prefs.tier === t.id ? 'is-active' : ''}`} onClick={() => set({ tier: t.id })}>
            <strong>{t.label}</strong>
            <small>{t.hint}</small>
          </button>
        ))}
      </div>

      {estimate && (
        <div className={`estimate ${estimate.total > prefs.budgetLimit ? 'is-over' : ''}`}>
          <span>
            Our rough estimate for {getDestination(prefs.destinationId).name}: <strong>{money(estimate.total, cur.code)}</strong>
          </span>
          <span>
            {estimate.total > prefs.budgetLimit
              ? `About ${money(estimate.total - prefs.budgetLimit, cur.code)} over — try a lighter tier or shorter trip.`
              : `Comfortably within budget, with ~${money(prefs.budgetLimit - estimate.total, cur.code)} to spare.`}
          </span>
        </div>
      )}
      <p className="note">
        <FiInfo /> Estimates use illustrative mock prices and fixed example exchange rates — not live fares or rates.
      </p>
    </div>
  );
}

function StepPace({ prefs, set }) {
  return (
    <div className="tiles tiles--3" role="radiogroup" aria-label="Pace">
      {PACES.map((p) => (
        <button key={p.id} role="radio" aria-checked={prefs.pace === p.id} className={`tile tile--pace ${prefs.pace === p.id ? 'is-active' : ''}`} onClick={() => set({ pace: p.id })}>
          <span className="pace-dots" aria-hidden="true">
            {Array.from({ length: 4 }, (_, i) => (
              <i key={i} className={i < p.perDay ? 'on' : ''} />
            ))}
          </span>
          <strong>{p.label}</strong>
          <small>{p.hint}</small>
        </button>
      ))}
    </div>
  );
}

/* ── Summary (boarding-pass) ─────────────────────────────────────────── */

function Summary({ prefs, step, go }) {
  const dest = getDestination(prefs.destinationId);
  const n = daysBetween(prefs.startDate, prefs.endDate);
  const rows = [
    { i: 0, k: 'Route', v: dest ? `${prefs.startCity || '—'} → ${dest.name}` : null },
    { i: 0, k: 'Travel', v: `${TRAVEL_MODES.find((m) => m.id === prefs.travelMode)?.label || 'Flight'} · ${TRIP_TYPES.find((t) => t.id === prefs.tripType)?.label || 'Round Trip'}` },
    { i: 1, k: 'Dates', v: n > 0 ? `${dateRange(prefs.startDate, prefs.endDate)} · ${n}d` : null },
    { i: 2, k: 'Travellers', v: `${prefs.travellers} · ${GROUPS.find((g) => g.id === prefs.group)?.label}` },
    { i: 3, k: 'Style', v: prefs.interests.length ? prefs.interests.map((id) => PERSONALITIES.find((p) => p.id === id)?.label.split(' ')[0]).join(', ') : null },
    { i: 4, k: 'Budget', v: `${money(prefs.budgetLimit, prefs.currency)} · ${TIERS.find((t) => t.id === prefs.tier)?.label}` },
    { i: 5, k: 'Pace', v: PACES.find((p) => p.id === prefs.pace)?.label },
  ];

  return (
    <aside className="pass" aria-label="Your selections">
      <div className="pass__media">
        {dest ? (
          <SmartImage key={dest.id} src={dest.image} alt={dest.name} label={dest.name} />
        ) : (
          <div className="pass__placeholder">
            <span className="hand">your destination here</span>
          </div>
        )}
        <div className="pass__dest">
          <small>Journey to</small>
          <strong>{dest ? dest.name : 'Somewhere wonderful'}</strong>
        </div>
      </div>
      <dl className="pass__rows">
        {rows.map((r) => (
          <div key={r.k} className={r.i === step ? 'is-current' : ''}>
            <dt>{r.k}</dt>
            <dd>
              <button onClick={() => go(r.i)} aria-label={`Edit ${r.k}`}>
                {r.v || <em>Not set yet</em>}
              </button>
            </dd>
          </div>
        ))}
      </dl>
      <p className="pass__foot hand">boarding soon ✈</p>
    </aside>
  );
}
