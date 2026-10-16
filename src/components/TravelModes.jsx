import { FiCheck } from 'react-icons/fi';
import { TRAVEL_MODES } from '../data/options';
import './TravelModes.css';

export default function TravelModes({ value, onChange }) {
  const active = TRAVEL_MODES.find((m) => m.id === value);
  return (
    <section className="section modes" id="modes" aria-labelledby="modes-title">
      <div className="container">
        <span className="eyebrow">Travel modes</span>
        <h2 id="modes-title" className="section-title">
          Choose Your Travel Mode
        </h2>
        <p className="section-lead">Pick how you like to move — we use it for route suggestions, cost estimates and the AI plan.</p>

        <div className="modes__grid" role="radiogroup" aria-label="Preferred travel mode">
          {TRAVEL_MODES.map((m) => {
            const Icon = m.icon;
            const on = m.id === value;
            return (
              <button key={m.id} role="radio" aria-checked={on} className={`mode ${on ? 'is-active' : ''}`} style={{ '--m': m.color }} onClick={() => onChange(m.id)}>
                {on && <FiCheck className="mode__check" aria-hidden="true" />}
                <Icon className="mode__icon" aria-hidden="true" />
                <strong>{m.label}</strong>
                <small>{m.sub}</small>
              </button>
            );
          })}
        </div>

        {active && (
          <p className="modes__tip" key={active.id} style={{ '--m': active.color }}>
            <strong>{active.label} tip:</strong> {active.tip}
          </p>
        )}
      </div>
    </section>
  );
}
