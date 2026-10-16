import { useEffect, useRef } from 'react';
import { FiX, FiArrowRight, FiCalendar, FiClock, FiCheck, FiInfo } from 'react-icons/fi';
import SmartImage from './SmartImage';
import { activityImage } from '../data/destinations';
import { indicativePerPerson } from '../utils/planner';
import { money } from '../utils/format';
import './DestinationModal.css';

export default function DestinationModal({ destination: d, onClose, onPlan }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [onClose]);

  const samples = d.activities.filter((a) => !a.arrival && !a.departure).slice(0, 3);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="dest-modal-title" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__panel">
        <button ref={closeRef} className="icon-btn modal__close" onClick={onClose} aria-label="Close details">
          <FiX />
        </button>
        <div className="modal__media">
          <SmartImage src={d.image} alt={`${d.name}, ${d.region}`} label={d.name} eager />
          <div className="modal__media-text">
            <span className="hand">{d.tagline}</span>
            <h2 id="dest-modal-title">{d.name}</h2>
            <p>{d.region}</p>
          </div>
        </div>
        <div className="modal__body">
          <p className="modal__desc">{d.description}</p>

          <div className="modal__facts">
            <div>
              <FiCalendar /> <small>Best time</small>
              <strong>{d.bestTime}</strong>
            </div>
            <div>
              <FiClock /> <small>Ideal stay</small>
              <strong>{d.idealDays}</strong>
            </div>
            <div>
              <span className="modal__rupee">₹</span> <small>Indicative, per person</small>
              <strong>{money(indicativePerPerson(d))}</strong>
            </div>
          </div>

          <h3 className="modal__h">Highlights</h3>
          <ul className="modal__highlights">
            {d.highlights.map((h) => (
              <li key={h}>
                <FiCheck /> {h}
              </li>
            ))}
          </ul>

          <h3 className="modal__h">A taste of the plan</h3>
          <ul className="modal__samples">
            {samples.map((a) => (
              <li key={a.id}>
                <SmartImage src={activityImage(a.image)} alt="" className="modal__sample-img" />
                <span>
                  <strong>{a.title}</strong>
                  <small>{a.desc}</small>
                </span>
              </li>
            ))}
          </ul>

          <p className="note">
            <FiInfo /> Budget is an illustrative estimate for 3 days, two travellers sharing, balanced comfort — not a live price.
          </p>

          <div className="modal__actions">
            <button className="btn btn-primary" onClick={() => onPlan(d.id)}>
              Plan a Trip Here <FiArrowRight />
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              Keep exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
