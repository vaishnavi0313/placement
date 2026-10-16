import { useState } from 'react';
import { FiPlus, FiRefreshCw, FiX, FiSun } from 'react-icons/fi';
import { addDays, money, prettyDate } from '../utils/format';
import { recommendations } from '../utils/planner';
import { activityImage } from '../data/destinations';
import ActivityItem from './ActivityItem';
import SmartImage from './SmartImage';

export default function ItineraryTimeline({ trip, actions }) {
  return (
    <div className="timeline">
      {trip.days.map((day, d) => (
        <DayBlock key={day.id} day={day} index={d} trip={trip} actions={actions} />
      ))}
    </div>
  );
}

function DayBlock({ day, index, trip, actions }) {
  const [adding, setAdding] = useState(false);
  const date = addDays(trip.startDate, index);
  const dayCost = day.activities.reduce((s, a) => s + a.cost, 0) * trip.travellers;
  const recs = adding ? recommendations(trip) : [];

  return (
    <article className="day" aria-labelledby={`day-${day.id}`}>
      <header className="day__head">
        <div className="day__num" aria-hidden="true">
          <small>Day</small>
          {index + 1}
        </div>
        <div className="day__title">
          <p>{prettyDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h3 id={`day-${day.id}`}>
            Day {index + 1} — {day.title}
          </h3>
        </div>
        <div className="day__tools">
          <span className="day__cost" title="Activities for the whole group">
            {money(dayCost, trip.currency)}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => actions.regenerate(index)}>
            <FiRefreshCw /> Regenerate day
          </button>
        </div>
      </header>

      {day.activities.length === 0 ? (
        <div className="day__empty">
          <FiSun aria-hidden="true" />
          <p>
            <strong>This day is wide open.</strong> Add an experience below, or keep it free for wandering.
          </p>
        </div>
      ) : (
        <ol className="day__list">
          {day.activities.map((a, i) => (
            <ActivityItem
              key={a.uid}
              activity={a}
              currency={trip.currency}
              travellers={trip.travellers}
              first={i === 0}
              last={i === day.activities.length - 1}
              onFavourite={() => actions.toggleFavourite(index, a.uid)}
              onRemove={() => actions.remove(index, a.uid)}
              onMove={(dir) => actions.move(index, a.uid, dir)}
            />
          ))}
        </ol>
      )}

      <div className="day__add">
        {!adding ? (
          <button className="day__add-btn" onClick={() => setAdding(true)}>
            <FiPlus /> Add an activity
          </button>
        ) : (
          <div className="recs">
            <div className="recs__head">
              <strong>Recommended for Day {index + 1}</strong>
              <button className="icon-btn" aria-label="Close recommendations" onClick={() => setAdding(false)}>
                <FiX />
              </button>
            </div>
            {recs.length === 0 ? (
              <p className="recs__empty">You’ve added every experience we have for this destination. Remove one to free up a swap.</p>
            ) : (
              <ul>
                {recs.map((r) => (
                  <li key={r.id}>
                    <SmartImage src={activityImage(r.image)} alt="" className="recs__img" />
                    <span className="recs__text">
                      <strong>{r.title}</strong>
                      <small>
                        {r.duration} · {r.cost ? `${money(r.cost, trip.currency)} pp` : 'Free'}
                        {r.gem && ' · Hidden gem'}
                      </small>
                    </span>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => {
                        actions.add(index, r);
                        setAdding(false);
                      }}
                    >
                      <FiPlus /> Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
