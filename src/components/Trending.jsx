import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AROUND_INDIA, getDestination } from '../data/destinations';
import SmartImage from './SmartImage';
import './Trending.css';

const TRIPS = [
  { title: 'Himalayan Adventure', ids: ['nepal', 'bhutan'] },
  { title: 'Tropical Escape', ids: ['srilanka', 'maldives'] },
  { title: 'City Explorer', ids: ['singapore', 'malaysia'] },
  { title: 'Cultural Heritage', ids: ['thailand', 'cambodia'] },
  { title: 'Desert & Dunes', ids: ['uae', 'oman'] },
  { title: 'Hill Station Hop', ids: ['ooty', 'munnar'] },
  { title: 'Bays & Lanterns', ids: ['vietnam', 'laos'] },
];

export default function Trending({ onOpen }) {
  const track = useRef(null);
  const scroll = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="section trending" aria-labelledby="trending-title">
      <div className="container">
        <header className="trending__head">
          <div>
            <span className="eyebrow">Trending now</span>
            <h2 id="trending-title" className="section-title">
              Trending Trips Around India
            </h2>
          </div>
          <div className="trending__arrows">
            <button className="icon-btn" aria-label="Previous trips" onClick={() => scroll(-1)}>
              <FiChevronLeft />
            </button>
            <button className="icon-btn" aria-label="More trips" onClick={() => scroll(1)}>
              <FiChevronRight />
            </button>
          </div>
        </header>

        <ul className="trending__track" ref={track}>
          {TRIPS.map((t) => {
            const [a, b] = t.ids.map(getDestination);
            return (
              <li key={t.title}>
                <button className="trip-card" onClick={() => onOpen(a)} aria-label={`${t.title}: ${a.name} and ${b.name}`}>
                  <SmartImage src={a.image} alt="" className="trip-card__img" label={a.name} />
                  <span className="trip-card__body">
                    <strong>{t.title}</strong>
                    <small>
                      {a.name} &amp; {b.name}
                    </small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="circles">
          <h3>15 Countries Near India</h3>
          <ul>
            {AROUND_INDIA.map((id) => {
              const d = getDestination(id);
              return (
                <li key={id}>
                  <button onClick={() => onOpen(d)} aria-label={`Open ${d.name}`}>
                    <SmartImage src={d.image} alt="" className="circles__img" />
                    <span>{d.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
