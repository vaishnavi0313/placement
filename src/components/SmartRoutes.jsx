import { FiArrowRight, FiInfo } from 'react-icons/fi';
import { MdOutlineHotel } from 'react-icons/md';
import { DESTINATIONS, STARTING_CITIES, getDestination } from '../data/destinations';
import { buildRoute } from '../utils/routes';
import './SmartRoutes.css';

export default function SmartRoutes({ prefs, setPrefs, onPlan }) {
  const startCity = prefs.startCity || 'Chennai';
  const dest = getDestination(prefs.destinationId) || getDestination('thailand');
  const steps = buildRoute(startCity, dest, prefs.travelMode);

  return (
    <section className="section routes" id="routes" aria-labelledby="routes-title">
      <div className="container">
        <header className="routes__head">
          <div>
            <span className="eyebrow">Best routes</span>
            <h2 id="routes-title" className="section-title">
              Smart Multi-Modal Routes
            </h2>
          </div>
          <div className="routes__pick">
            <label>
              <span className="sr-only">From</span>
              <select className="input input--sm" value={startCity} onChange={(e) => setPrefs((p) => ({ ...p, startCity: e.target.value }))}>
                {STARTING_CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <FiArrowRight aria-hidden="true" />
            <label>
              <span className="sr-only">To</span>
              <select className="input input--sm" value={dest.id} onChange={(e) => setPrefs((p) => ({ ...p, destinationId: e.target.value }))}>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <ol className="route" key={`${startCity}-${dest.id}-${prefs.travelMode}`}>
          {steps.map((s, i) => {
            const Icon = s.mode === 'stay' ? MdOutlineHotel : s.info?.icon;
            const color = s.mode === 'stay' ? '#8B5CF6' : s.info?.color || '#1A73E8';
            return (
              <li key={i} className="route__step" style={{ '--c': color, animationDelay: `${i * 90}ms` }}>
                <span className="route__icon">{Icon && <Icon aria-hidden="true" />}</span>
                <strong>{s.mode === 'stay' ? 'Stay' : s.info?.label}</strong>
                <small>{s.mode === 'stay' ? s.to : `${s.from} → ${s.to}`}</small>
                {s.duration && <small className="route__dur">({s.duration})</small>}
              </li>
            );
          })}
        </ol>

        <div className="routes__foot">
          <p className="note">
            <FiInfo /> Illustrative route and rough durations — check live schedules before booking.
          </p>
          <button
            className="btn btn-teal btn-sm"
            onClick={() => {
              setPrefs((p) => ({ ...p, startCity, destinationId: dest.id }));
              onPlan();
            }}
          >
            Plan this route <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
