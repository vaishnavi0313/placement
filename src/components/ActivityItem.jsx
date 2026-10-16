import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown, FiHeart, FiTrash2, FiClock } from 'react-icons/fi';
import { activityImage } from '../data/destinations';
import { money } from '../utils/format';
import SmartImage from './SmartImage';

export default function ActivityItem({ activity: a, currency, travellers, first, last, onFavourite, onRemove, onMove }) {
  const [open, setOpen] = useState(false);
  const detailsId = `act-${a.uid}`;

  return (
    <li className={`act ${a.favourite ? 'is-fav' : ''} ${open ? 'is-open' : ''}`}>
      <time className="act__time">{a.time}</time>
      <span className="act__dot" aria-hidden="true" />
      <div className="act__card">
        <SmartImage src={activityImage(a.image)} alt="" className="act__img" />
        <div className="act__main">
          <div className="act__top">
            <h4>{a.title}</h4>
            <div className="act__badges">
              {a.optional && <span className="tag tag--optional">Optional</span>}
              {a.gem && <span className="tag tag--gem">Hidden gem</span>}
              {a.favourite && <span className="tag tag--fav">Favourite</span>}
            </div>
          </div>
          <p className="act__desc">{a.desc}</p>
          <p className="act__meta">
            <span>
              <FiClock aria-hidden="true" /> {a.duration}
            </span>
            <span>{a.cost ? `${money(a.cost, currency)} pp · ${money(a.cost * travellers, currency)} total` : 'No cost'}</span>
          </p>
          {open && (
            <p className="act__details" id={detailsId}>
              {a.details}
            </p>
          )}
          <div className="act__actions">
            <button className="act__expand" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen((o) => !o)}>
              {open ? <FiChevronUp /> : <FiChevronDown />} {open ? 'Less' : 'Details'}
            </button>
            <span className="act__spacer" />
            <button className={`icon-btn ${a.favourite ? 'is-on' : ''}`} aria-pressed={a.favourite} aria-label={a.favourite ? 'Remove from favourites' : 'Mark as favourite'} onClick={onFavourite}>
              <FiHeart />
            </button>
            <button className="icon-btn" aria-label="Move earlier" disabled={first} onClick={() => onMove(-1)}>
              <FiArrowUp />
            </button>
            <button className="icon-btn" aria-label="Move later" disabled={last} onClick={() => onMove(1)}>
              <FiArrowDown />
            </button>
            <button className="icon-btn icon-btn--danger" aria-label={`Remove ${a.title}`} onClick={onRemove}>
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
