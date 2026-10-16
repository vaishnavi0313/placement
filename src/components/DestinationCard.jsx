import SmartImage from './SmartImage';
import { indicativePerPerson } from '../utils/planner';
import { money } from '../utils/format';

export default function DestinationCard({ destination: d, index = 0, matchesMood, onOpen }) {
  return (
    <article className="dest-card" style={{ animationDelay: `${Math.min(index, 14) * 30}ms` }}>
      <button className="dest-card__btn" onClick={() => onOpen(d)} aria-label={`Open ${d.name} details`}>
        <SmartImage src={d.image} alt={`${d.name}, ${d.region}`} className="dest-card__img" label={d.name} />
        {matchesMood && <span className="dest-card__mood">Fits your mood</span>}
        <span className="dest-card__body">
          <strong className="dest-card__name">{d.name}</strong>
          <span className="dest-card__desc">{d.short || d.tagline}</span>
          <span className="dest-card__price">from {money(indicativePerPerson(d), 'INR', { compact: true })} pp</span>
        </span>
      </button>
    </article>
  );
}
