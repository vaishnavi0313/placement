import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { PLANNING_MESSAGES } from '../data/options';
import { getDestination } from '../data/destinations';
import './PlanningOverlay.css';

const STEP_MS = 1050;

/**
 * Planning progress overlay. The messages are a visual progress cue: with
 * Claude/Gemini connected the real request runs in App while this animates;
 * in Demo mode the sample planner finishes instantly and we just play it out.
 */
export default function PlanningOverlay({ prefs, done, providerLabel, onFinish, onCancel }) {
  const [index, setIndex] = useState(0);
  const dest = getDestination(prefs.destinationId);
  const finish = useRef(onFinish);
  finish.current = onFinish;
  const last = PLANNING_MESSAGES.length - 1;

  useEffect(() => {
    if (index < last) {
      const t = setTimeout(() => setIndex((i) => i + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    if (index === last && done) {
      const t = setTimeout(() => setIndex(last + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    if (index > last) {
      const t = setTimeout(() => finish.current(), 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [index, done, last]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const waiting = index === last && !done;
  const pct = Math.min(100, ((index + (waiting ? 0.6 : 0)) / PLANNING_MESSAGES.length) * 100);

  return (
    <div className="planning" role="status" aria-live="polite" aria-label="Preparing your itinerary">
      <div className="planning__card">
        <button className="icon-btn planning__cancel" onClick={onCancel} aria-label="Cancel planning">
          <FiX />
        </button>
        <svg className="planning__map" viewBox="0 0 320 140" aria-hidden="true">
          <path className="planning__route" d="M20 110 C 70 30, 120 130, 170 70 S 260 20, 300 40" />
          {[
            [20, 110],
            [170, 70],
            [300, 40],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" className="planning__pin" style={{ animationDelay: `${i * 1.1}s` }} />
          ))}
          <g className="planning__plane">
            <path d="M0 -6 L14 0 L0 6 L3 0 Z" />
          </g>
        </svg>
        <p className="planning__dest">
          {prefs.startCity} → {dest?.name}
        </p>
        <ul className="planning__list">
          {PLANNING_MESSAGES.map((m, i) => (
            <li key={m} className={i < index ? 'is-done' : i === index ? 'is-active' : ''}>
              <span className="planning__tick">{i < index ? <FiCheck /> : <i />}</span>
              {m}
            </li>
          ))}
        </ul>
        <div className="planning__bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="planning__note">{providerLabel ? (waiting ? `Waiting for ${providerLabel}…` : `Planning with ${providerLabel}`) : 'Planning your trip…'}</p>
      </div>
    </div>
  );
}
