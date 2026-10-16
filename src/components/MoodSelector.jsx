import { MOODS } from '../data/options';
import './MoodSelector.css';

export default function MoodSelector({ value, onChange }) {
  return (
    <fieldset className="mood">
      <legend className="mood__legend">What’s your travel mood?</legend>
      <div className="mood__options" role="radiogroup">
        {MOODS.map((m) => {
          const Icon = m.icon;
          const active = m.id === value;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`mood__option ${active ? 'is-active' : ''}`}
              style={{ '--m': m.accent, '--m-soft': m.soft }}
              onClick={() => onChange(m.id)}
              title={m.note}
            >
              <Icon aria-hidden="true" />
              {m.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
