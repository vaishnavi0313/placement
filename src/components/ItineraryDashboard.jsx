import { useMemo, useState } from 'react';
import { FiBookmark, FiCalendar, FiEdit3, FiInfo, FiRotateCcw, FiUsers, FiFileText, FiMapPin } from 'react-icons/fi';
import { getDestination } from '../data/destinations';
import { COMPANION_CHIPS, GROUPS, PACES, PERSONALITIES, TRAVEL_MODES } from '../data/options';
import { reviseWithAI } from '../ai/aiPlanner';

const TRIP_TYPE_LABEL = { round: 'Round Trip', oneway: 'One Way' };
import { PROVIDERS } from '../ai/config';
import { addActivity, applyCompanion, computeBudget, generateItinerary, regenerateDay, retime, tripLength, updateDay } from '../utils/planner';
import { dateRange, money } from '../utils/format';
import SmartImage from './SmartImage';
import ItineraryTimeline from './ItineraryTimeline';
import BudgetBreakdown from './BudgetBreakdown';
import JourneyMap from './JourneyMap';
import JourneyCompanion from './JourneyCompanion';
import './ItineraryDashboard.css';

export default function ItineraryDashboard({ trip, setTrip, onSave, isSaved, notify, onEditPreferences, ai, aiLabel }) {
  const [history, setHistory] = useState([]);
  const [companion, setCompanion] = useState(null);
  const dest = getDestination(trip.destinationId);
  const budget = useMemo(() => computeBudget(trip), [trip]);
  const days = tripLength(trip);

  // Every edit goes through here so it can be undone.
  const commit = (next, message) => {
    setHistory((h) => [...h.slice(-19), trip]);
    setTrip(next);
    if (message) notify(message);
  };

  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setTrip(prev);
    setCompanion(null);
    notify('Change undone');
  };

  const actions = {
    toggleFavourite: (d, id) =>
      commit(updateDay(trip, d, (list) => list.map((a) => (a.uid === id ? { ...a, favourite: !a.favourite } : a)))),
    remove: (d, id) => {
      const a = trip.days[d].activities.find((x) => x.uid === id);
      commit(updateDay(trip, d, (list) => list.filter((x) => x.uid !== id)), `Removed “${a.title}”`);
    },
    move: (d, id, dir) =>
      commit(
        updateDay(trip, d, (list) => {
          const i = list.findIndex((a) => a.uid === id);
          const j = i + dir;
          if (j < 0 || j >= list.length) return list;
          const next = [...list];
          [next[i], next[j]] = [next[j], next[i]];
          return retime(next);
        }),
      ),
    add: (d, activity) => commit(addActivity(trip, d, activity), `Added “${activity.title}” to Day ${d + 1}`),
    regenerate: (d) => {
      const { trip: next, changed } = regenerateDay(trip, d);
      if (!changed) {
        notify('No alternative plans left for this day — try removing an activity elsewhere.');
        return;
      }
      commit(next, `Day ${d + 1} refreshed with an alternative plan`);
    },
  };

  const changePace = (pace) => {
    if (pace === trip.pace) return;
    const regenerated = generateItinerary({ ...trip, pace });
    commit({ ...regenerated, id: trip.id }, `Switched to a ${PACES.find((p) => p.id === pace).label.toLowerCase()} schedule`);
  };

  const runPreset = (chipId, prefix = '') => {
    const before = budget.total;
    const result = applyCompanion(trip, chipId);
    const label = COMPANION_CHIPS.find((c) => c.id === chipId)?.label;
    if (result.trip !== trip) {
      const after = computeBudget(result.trip).total;
      commit(result.trip);
      setCompanion({ chipId, label, message: prefix + result.message, delta: after - before, suggestions: result.suggestions });
    } else {
      setCompanion({ chipId, label, message: prefix + result.message, suggestions: result.suggestions });
    }
  };

  // With Claude/Gemini connected, requests go to the model; otherwise (or on
  // failure) the predefined adjustment for that chip is applied.
  const askAI = async (chipId, instruction) => {
    const before = budget.total;
    setCompanion({ chipId, label: instruction, loading: true });
    try {
      const result = await reviseWithAI(trip, instruction, ai.settings);
      const after = computeBudget(result.trip).total;
      commit(result.trip);
      setCompanion({ chipId, label: instruction, message: result.message, delta: after - before, ai: true });
    } catch (err) {
      if (chipId === 'custom') {
        setCompanion({ chipId, label: instruction, message: `${err.message || 'The AI request failed.'} Try again, or use one of the quick suggestions.` });
      } else {
        runPreset(chipId, `${aiLabel} was unavailable (${err.message}) — applied a quick preset instead. `);
      }
    }
  };

  const runCompanion = (chipId) => {
    if (ai.ready && chipId !== 'rainy') {
      askAI(chipId, COMPANION_CHIPS.find((c) => c.id === chipId).label);
    } else {
      runPreset(chipId);
    }
  };

  const group = GROUPS.find((g) => g.id === trip.group);
  const styles = trip.interests.map((id) => PERSONALITIES.find((p) => p.id === id)?.label).filter(Boolean);

  return (
    <section className="section dashboard" id="itinerary" aria-labelledby="itinerary-title">
      <div className="container">
        <header className="overview reveal">
          <div className="overview__media">
            <SmartImage src={dest.image} alt={`${dest.name}, ${dest.region}`} label={dest.name} eager />
            <span className="stamp overview__stamp" aria-hidden="true">
              {days} days
              <br />
              {dest.name}
            </span>
          </div>
          <div className="overview__body">
            <span className="eyebrow">Your personalised itinerary</span>
            <h2 id="itinerary-title" className="overview__title">
              {days} {days === 1 ? 'day' : 'days'} in <span>{dest.name}</span>
            </h2>
            <p className="overview__source">
              {trip.source && trip.source !== 'demo' ? `Planned by ${PROVIDERS[trip.source]?.short || 'AI'} · ` : ''}
              {TRAVEL_MODES.find((m) => m.id === trip.travelMode)?.label || 'Flight'} · {TRIP_TYPE_LABEL[trip.tripType] || 'Round Trip'}
            </p>
            {trip.summary && <p className="overview__summary">{trip.summary}</p>}
            <dl className="overview__facts">
              <div>
                <dt>
                  <FiMapPin /> Route
                </dt>
                <dd>
                  {trip.startCity} → {dest.name}
                </dd>
              </div>
              <div>
                <dt>
                  <FiCalendar /> Dates
                </dt>
                <dd>{dateRange(trip.startDate, trip.endDate)}</dd>
              </div>
              <div>
                <dt>
                  <FiUsers /> Travellers
                </dt>
                <dd>
                  {trip.travellers} · {group?.label}
                </dd>
              </div>
              <div>
                <dt>Est. total</dt>
                <dd className="overview__total">{money(budget.total, trip.currency)}</dd>
              </div>
            </dl>
            <ul className="overview__styles" aria-label="Travel style">
              {styles.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
              <li className="tag tag--pace">{PACES.find((p) => p.id === trip.pace)?.label}</li>
            </ul>

            <div className="overview__actions">
              <button className="btn btn-primary btn-sm" onClick={() => onSave(trip, 'upcoming')}>
                <FiBookmark /> {isSaved ? 'Update saved journey' : 'Save journey'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onSave(trip, 'draft')}>
                <FiFileText /> Save as draft
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onEditPreferences}>
                <FiEdit3 /> Edit preferences
              </button>
              <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!history.length}>
                <FiRotateCcw /> Undo
              </button>
            </div>
          </div>
        </header>

        <div className="pace-switch" role="radiogroup" aria-label="Schedule pace">
          <span className="pace-switch__label">Schedule</span>
          {PACES.map((p) => (
            <button key={p.id} role="radio" aria-checked={trip.pace === p.id} className={trip.pace === p.id ? 'is-active' : ''} onClick={() => changePace(p.id)}>
              {p.label}
            </button>
          ))}
        </div>

        <p className="note dashboard__disclaimer">
          <FiInfo /> These are suggestions only. Please verify actual opening hours, prices and travel conditions before you go.
        </p>

        <div className="dashboard__grid">
          <ItineraryTimeline trip={trip} actions={actions} />
          <aside className="dashboard__aside">
            <BudgetBreakdown budget={budget} limit={trip.budgetLimit} currency={trip.currency} travellers={trip.travellers} />
            <JourneyCompanion
              state={companion}
              onChip={runCompanion}
              onAsk={(text) => askAI('custom', text)}
              aiReady={ai.ready}
              aiLabel={aiLabel}
              onDismiss={() => setCompanion(null)}
              onUndo={history.length ? undo : null}
              currency={trip.currency}
              days={trip.days}
              onAddSuggestion={(dayIndex, activity) => actions.add(dayIndex, activity)}
              usedIds={new Set(trip.days.flatMap((d) => d.activities.map((a) => a.id)))}
            />
          </aside>
        </div>

        <JourneyMap trip={trip} destination={dest} />
      </div>
    </section>
  );
}
