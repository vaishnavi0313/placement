import { useState } from 'react';
import { FiMapPin, FiNavigation, FiCalendar, FiUsers, FiCreditCard, FiZap, FiAlertCircle, FiSliders } from 'react-icons/fi';
import { MdOutlineRoute, MdOutlineMap, MdOutlineSavings, MdOutlineAutoAwesome } from 'react-icons/md';
import { DESTINATIONS, STARTING_CITIES } from '../data/destinations';
import { TRIP_TYPES } from '../data/options';
import { IMAGES } from '../data/images';
import { addDays, today } from '../utils/format';
import { validateStep } from './TripBuilder';
import MoodSelector from './MoodSelector';
import SmartImage from './SmartImage';
import './Hero.css';

const BUDGETS = [
  { label: 'Flexible budget', value: 600000 },
  { label: 'Under ₹25,000', value: 25000 },
  { label: 'Under ₹50,000', value: 50000 },
  { label: 'Under ₹1,00,000', value: 100000 },
  { label: 'Under ₹2,00,000', value: 200000 },
  { label: 'Under ₹4,00,000', value: 400000 },
];

export default function Hero({ prefs, setPrefs, mood, onMood, onGenerate, onCustomise, aiLabel }) {
  const [error, setError] = useState('');
  const set = (patch) => {
    setError('');
    setPrefs((p) => ({ ...p, ...patch }));
  };

  const generate = () => {
    for (const i of [0, 1, 2]) {
      const msg = validateStep(i, prefs);
      if (msg) {
        setError(msg);
        return;
      }
    }
    onGenerate();
  };

  const budgetValue = BUDGETS.some((b) => b.value === prefs.budgetLimit) ? prefs.budgetLimit : '';

  return (
    <section className="hero" id="top">
      <div className="hero__bg">
        <SmartImage src={IMAGES.heroMountains} alt="" eager />
      </div>
      <div className="container hero__inner">
        <div className="hero__copy reveal">
          <h1 className="hero__title">
            <span>AI</span> Travel Planner
          </h1>
          <p className="hero__sub">Plan smarter. Explore farther.</p>
          <p className="hero__lead">Discover amazing destinations in and around India with AI-powered itineraries, best routes, stays, budgets and more.</p>
        </div>

        <form
          className="search-card reveal"
          onSubmit={(e) => {
            e.preventDefault();
            generate();
          }}
          aria-label="Quick trip search"
        >
          <div className="search-card__tabs" role="tablist" aria-label="Trip type">
            {TRIP_TYPES.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={prefs.tripType === t.id} className={prefs.tripType === t.id ? 'is-active' : ''} onClick={() => set({ tripType: t.id })}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="search-card__fields">
            <label className="sfield">
              <span className="sfield__label">
                <FiMapPin /> From
              </span>
              <select value={prefs.startCity} onChange={(e) => set({ startCity: e.target.value })}>
                <option value="">Your city</option>
                {STARTING_CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="sfield">
              <span className="sfield__label">
                <FiNavigation /> To
              </span>
              <select value={prefs.destinationId} onChange={(e) => set({ destinationId: e.target.value, flexible: false })}>
                <option value="">Destination</option>
                <optgroup label="Around India">
                  {DESTINATIONS.filter((d) => d.categories.includes('neighbours')).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="India">
                  {DESTINATIONS.filter((d) => d.country === 'India').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Further away">
                  {DESTINATIONS.filter((d) => d.country !== 'India' && !d.categories.includes('neighbours')).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <div className="sfield sfield--dates">
              <span className="sfield__label">
                <FiCalendar /> Travel dates
              </span>
              <span className="sfield__dates">
                <input
                  type="date"
                  aria-label="Start date"
                  min={today()}
                  value={prefs.startDate}
                  onChange={(e) => {
                    const start = e.target.value;
                    set({ startDate: start, endDate: start && start > prefs.endDate ? addDays(start, 2) : prefs.endDate });
                  }}
                />
                <span aria-hidden="true">→</span>
                <input type="date" aria-label="End date" min={prefs.startDate || today()} value={prefs.endDate} onChange={(e) => set({ endDate: e.target.value, duration: '' })} />
              </span>
            </div>
            <label className="sfield sfield--small">
              <span className="sfield__label">
                <FiUsers /> Travellers
              </span>
              <select
                value={prefs.travellers}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  set({ travellers: n, group: n === 1 ? 'solo' : n === 2 && prefs.group === 'solo' ? 'couple' : n > 2 && ['solo', 'couple'].includes(prefs.group) ? 'friends' : prefs.group });
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Traveller' : 'Travellers'}
                  </option>
                ))}
              </select>
            </label>
            <label className="sfield sfield--small">
              <span className="sfield__label">
                <FiCreditCard /> Budget
              </span>
              <select value={budgetValue} onChange={(e) => set({ budgetLimit: Number(e.target.value) })}>
                {budgetValue === '' && <option value="">Custom</option>}
                {BUDGETS.map((b) => (
                  <option key={b.label} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="search-card__error" role="alert">
              <FiAlertCircle /> {error}
            </p>
          )}

          <div className="search-card__actions">
            <button type="submit" className="btn btn-primary search-card__go">
              Generate My Trip <FiZap />
            </button>
            <button type="button" className="btn btn-ghost" onClick={onCustomise}>
              <FiSliders /> Customise
            </button>
          </div>

          <ul className="search-card__perks">
            <li>
              <MdOutlineRoute /> Best Routes
            </li>
            <li>
              <MdOutlineMap /> Personalized Itinerary
            </li>
            <li>
              <MdOutlineSavings /> Budget Estimates
            </li>
            <li>
              <MdOutlineAutoAwesome /> Planned by {aiLabel}
            </li>
          </ul>
        </form>

        <div className="hero__mood">
          <MoodSelector value={mood.id} onChange={onMood} />
        </div>
      </div>
    </section>
  );
}
