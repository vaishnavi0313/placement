import { useMemo, useState } from 'react';
import { FiAlertTriangle, FiClock, FiNavigation } from 'react-icons/fi';
import { activityImage } from '../data/destinations';
import { money } from '../utils/format';
import SmartImage from './SmartImage';
import './JourneyMap.css';

const H = 64; // map height in viewBox units (width is 100)
const DAY_COLORS = ['#0D9488', '#F28C75', '#3B6EA8', '#E0A43B', '#7A5BA8', '#C2483A', '#2F8F5B', '#D9733F', '#4A90A4', '#8A6D3B'];

function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i - 1];
    const c = points[i];
    const mx = (p.x + c.x) / 2;
    const my = (p.y + c.y) / 2;
    // bow each leg slightly so the route reads as a journey, not a straight line
    const bow = i % 2 ? 4 : -4;
    d += ` Q ${mx + bow} ${my - bow} ${c.x} ${c.y}`;
  }
  return d;
}

export default function JourneyMap({ trip, destination }) {
  const [day, setDay] = useState('all');
  const [selected, setSelected] = useState(null);

  const stops = useMemo(() => {
    let n = 0;
    return trip.days.flatMap((d, di) =>
      d.activities.map((a) => {
        n += 1;
        return { ...a, n, day: di, px: 6 + a.x * 0.88, py: 5 + (a.y / 100) * (H - 10) };
      }),
    );
  }, [trip]);

  const visible = day === 'all' ? stops : stops.filter((s) => s.day === day);
  const active = stops.find((s) => s.uid === selected) || visible[0] || null;
  const path = smoothPath(visible.map((s) => ({ x: s.px, y: s.py })));

  return (
    <section className="jmap" aria-labelledby="jmap-title">
      <header className="jmap__head">
        <div>
          <span className="eyebrow">Journey map</span>
          <h3 id="jmap-title">Your route through {destination.name}</h3>
        </div>
        <div className="jmap__filters" role="group" aria-label="Show day on map">
          <button className={`chip ${day === 'all' ? 'is-active' : ''}`} onClick={() => setDay('all')}>
            All days
          </button>
          {trip.days.map((d, i) => (
            <button key={d.id} className={`chip ${day === i ? 'is-active' : ''}`} onClick={() => { setDay(i); setSelected(null); }}>
              <i className="jmap__swatch" style={{ background: DAY_COLORS[i % DAY_COLORS.length] }} /> Day {i + 1}
            </button>
          ))}
        </div>
      </header>

      <div className="jmap__body">
        <div className={`jmap__canvas jmap__canvas--${destination.mapTheme}`}>
          {stops.length === 0 ? (
            <p className="jmap__empty">Add a few activities and your route will appear here.</p>
          ) : (
            <svg viewBox={`0 0 100 ${H}`} role="img" aria-label={`Schematic route with ${visible.length} stops`}>
              <MapTerrain theme={destination.mapTheme} />
              {path && <path key={`${day}-${visible.length}-${trip.days.map((d) => d.activities.length).join('')}`} className="jmap__route" d={path} pathLength="1" />}
              {visible.map((s) => {
                const isActive = active?.uid === s.uid;
                return (
                  <g
                    key={s.uid}
                    className={`jmap__pin ${isActive ? 'is-active' : ''}`}
                    transform={`translate(${s.px} ${s.py})`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Stop ${s.n}: ${s.title}, Day ${s.day + 1}`}
                    onClick={() => setSelected(s.uid)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(s.uid))}
                  >
                    <circle r={isActive ? 3.6 : 2.8} fill={DAY_COLORS[s.day % DAY_COLORS.length]} />
                    <text y="1" textAnchor="middle">
                      {s.n}
                    </text>
                  </g>
                );
              })}
              <g className="jmap__compass" transform="translate(92 9)">
                <circle r="4.5" />
                <path d="M0 -3.4 L1.2 0 L0 3.4 L-1.2 0 Z" />
                <text y="-5.6" textAnchor="middle">
                  N
                </text>
              </g>
            </svg>
          )}
          <p className="jmap__legend">
            <FiAlertTriangle aria-hidden="true" /> Illustrative route · not to scale · not for navigation
          </p>
        </div>

        <div className="jmap__detail" aria-live="polite">
          {active ? (
            <div className="jmap__card" key={active.uid}>
              <SmartImage src={activityImage(active.image)} alt="" className="jmap__img" />
              <span className="jmap__stop" style={{ background: DAY_COLORS[active.day % DAY_COLORS.length] }}>
                Stop {active.n} · Day {active.day + 1}
              </span>
              <h4>{active.title}</h4>
              <p>{active.desc}</p>
              <p className="jmap__meta">
                <span>
                  <FiClock /> {active.time} · {active.duration}
                </span>
                <span>{active.cost ? `${money(active.cost, trip.currency)} pp` : 'No cost'}</span>
              </p>
            </div>
          ) : (
            <p className="jmap__hint">Select a numbered marker to see its details.</p>
          )}
          <ol className="jmap__stops">
            {visible.map((s) => (
              <li key={s.uid}>
                <button className={active?.uid === s.uid ? 'is-active' : ''} onClick={() => setSelected(s.uid)}>
                  <span style={{ background: DAY_COLORS[s.day % DAY_COLORS.length] }}>{s.n}</span>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
          <p className="jmap__nav-note">
            <FiNavigation /> Use a navigation app for real directions.
          </p>
        </div>
      </div>
    </section>
  );
}

function MapTerrain({ theme }) {
  switch (theme) {
    case 'coast':
      return (
        <g className="terrain">
          <path className="terrain__sea" d={`M0 0 H22 C 18 14, 26 24, 16 36 S 20 56, 12 ${H} H0 Z`} />
          {[12, 26, 40, 54].map((y) => (
            <path key={y} className="terrain__wave" d={`M3 ${y} q 2 -1.5 4 0 t 4 0`} />
          ))}
          <path className="terrain__land" d={`M40 10 q 20 -6 40 6 t 14 30`} />
        </g>
      );
    case 'desert':
      return (
        <g className="terrain">
          {[14, 28, 42, 56].map((y, i) => (
            <path key={y} className="terrain__dune" d={`M0 ${y} C 20 ${y - 6}, 35 ${y + 4}, 55 ${y - 2} S 85 ${y - 6}, 100 ${y}`} style={{ opacity: 0.5 + i * 0.1 }} />
          ))}
        </g>
      );
    case 'island':
      return (
        <g className="terrain">
          <rect className="terrain__sea" width="100" height={H} />
          <path className="terrain__island" d="M10 40 C 6 22, 30 6, 52 8 S 92 14, 92 32 S 76 60, 50 58 S 14 58, 10 40 Z" />
          <path className="terrain__island" d="M82 52 c 4 -4 12 -2 12 4 s -10 6 -12 -4 Z" />
        </g>
      );
    case 'alps':
      return (
        <g className="terrain">
          {[
            [8, 52, 22],
            [24, 56, 26],
            [44, 50, 20],
            [62, 54, 24],
          ].map(([x, y, w]) => (
            <g key={x}>
              <path className="terrain__peak" d={`M${x} ${y} L${x + w / 2} ${y - w * 0.9} L${x + w} ${y} Z`} />
              <path className="terrain__snow" d={`M${x + w / 2 - 3} ${y - w * 0.9 + 6} L${x + w / 2} ${y - w * 0.9} L${x + w / 2 + 3} ${y - w * 0.9 + 6} Z`} />
            </g>
          ))}
          <ellipse className="terrain__lake" cx="56" cy="34" rx="16" ry="5" />
        </g>
      );
    default:
      return (
        <g className="terrain">
          {[8, 16, 24, 32].map((r) => (
            <ellipse key={r} className="terrain__contour" cx="72" cy="22" rx={r * 1.3} ry={r * 0.8} />
          ))}
          {[6, 12, 18].map((r) => (
            <ellipse key={`b${r}`} className="terrain__contour" cx="20" cy="46" rx={r * 1.4} ry={r * 0.7} />
          ))}
          <path className="terrain__river" d={`M0 30 C 20 34, 30 26, 46 38 S 70 ${H - 6}, 100 ${H - 4}`} />
        </g>
      );
  }
}
