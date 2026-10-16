import { useState } from 'react';
import { FiArrowRight, FiTrash2, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { getDestination } from '../data/destinations';
import { computeBudget, tripLength } from '../utils/planner';
import { dateRange, money } from '../utils/format';
import SmartImage from './SmartImage';
import './MyJourneys.css';

const TABS = [
  { id: 'upcoming', label: 'Upcoming', empty: 'No upcoming journeys yet. Save an itinerary to see it here.' },
  { id: 'draft', label: 'Drafts', empty: 'No drafts. Use “Save as draft” on any itinerary to keep working on it later.' },
  { id: 'past', label: 'Past journeys', empty: 'Your travel memories will collect here.' },
];

export default function MyJourneys({ journeys, onOpen, onRemove, onRestore, onPlan, activeId }) {
  const [tab, setTab] = useState('upcoming');
  const [confirm, setConfirm] = useState(null);
  const list = journeys.filter((j) => j.status === tab && getDestination(j.destinationId));
  const current = TABS.find((t) => t.id === tab);

  return (
    <section className="section journeys" id="journeys">
      <div className="container">
        <header className="journeys__head">
          <div>
            <span className="eyebrow">My Journeys</span>
            <h2 className="section-title">Your travel shelf</h2>
            <p className="section-lead">Saved in this browser — no account needed.</p>
          </div>
          <div className="journeys__tabs" role="tablist" aria-label="Journey type">
            {TABS.map((t) => {
              const count = journeys.filter((j) => j.status === t.id).length;
              return (
                <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
                  {t.label} <span>{count}</span>
                </button>
              );
            })}
          </div>
        </header>

        {list.length === 0 ? (
          <div className="journeys__empty" role="tabpanel">
            <div className="stamp" aria-hidden="true">
              nothing
              <br />
              here yet
            </div>
            <p>{current.empty}</p>
            <div className="journeys__empty-actions">
              <button className="btn btn-dark btn-sm" onClick={onPlan}>
                <FiPlus /> Plan a journey
              </button>
              {!journeys.some((j) => j.sample) && (
                <button className="btn btn-ghost btn-sm" onClick={onRestore}>
                  <FiRefreshCw /> Restore sample journeys
                </button>
              )}
            </div>
          </div>
        ) : (
          <ul className="journeys__list" role="tabpanel">
            {list.map((j, i) => {
              const dest = getDestination(j.destinationId);
              const budget = computeBudget(j);
              const days = tripLength(j);
              return (
                <li key={j.id} className={`jcard ${activeId === j.id ? 'is-active' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
                  <SmartImage src={dest.image} alt={dest.name} className="jcard__img" label={dest.name} />
                  <div className="jcard__body">
                    <div className="jcard__top">
                      <span className="tag">{j.sample ? 'Sample' : TABS.find((t) => t.id === j.status).label.replace(/s$/, '')}</span>
                      <span className="jcard__days">{days} days</span>
                    </div>
                    <h3>{dest.name}</h3>
                    <p className="jcard__dates">{dateRange(j.startDate, j.endDate)}</p>
                    <p className="jcard__meta">
                      {j.travellers} {j.travellers === 1 ? 'traveller' : 'travellers'} · from {j.startCity} · est. {money(budget.total, j.currency)}
                    </p>
                    <div className="jcard__actions">
                      <button className="btn btn-dark btn-sm" onClick={() => onOpen(j)}>
                        {activeId === j.id ? 'Viewing' : 'Open'} <FiArrowRight />
                      </button>
                      {confirm === j.id ? (
                        <span className="jcard__confirm">
                          Remove?
                          <button className="btn btn-sm jcard__yes" onClick={() => { onRemove(j.id); setConfirm(null); }}>
                            Yes
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>
                            No
                          </button>
                        </span>
                      ) : (
                        <button className="icon-btn" aria-label={`Remove ${dest.name} journey`} onClick={() => setConfirm(j.id)}>
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
