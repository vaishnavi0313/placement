import { useMemo, useState } from 'react';
import { FiSearch, FiX, FiChevronRight } from 'react-icons/fi';
import { CATEGORIES, DESTINATIONS } from '../data/destinations';
import DestinationCard from './DestinationCard';
import './Discover.css';

export default function Discover({ mood, onOpen }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('neighbours');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESTINATIONS.filter((d) => category === 'all' || d.categories.includes(category)).filter(
      (d) => !q || [d.name, d.region, d.country, d.tagline, d.short || '', ...d.highlights].some((s) => s.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const title = category === 'neighbours' && !query ? 'Explore 15 Countries Around India' : category === 'all' ? 'All destinations' : CATEGORIES.find((c) => c.id === category)?.label;

  return (
    <section className="section discover" id="discover">
      <div className="container">
        <header className="discover__head">
          <div>
            <span className="eyebrow">Destinations</span>
            <h2 className="section-title">{title}</h2>
          </div>
          <button className="discover__all" onClick={() => { setCategory('all'); setQuery(''); }}>
            View all <FiChevronRight />
          </button>
        </header>

        <div className="discover__tools">
          <label className="search">
            <FiSearch aria-hidden="true" />
            <span className="sr-only">Search destinations</span>
            <input id="dest-search" type="search" placeholder="Search a country, city or highlight…" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && (
              <button className="search__clear" aria-label="Clear search" onClick={() => setQuery('')}>
                <FiX />
              </button>
            )}
          </label>
          <div className="discover__filters" role="group" aria-label="Filter destinations">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`chip ${category === c.id ? 'is-active' : ''}`} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <p className="discover__count" aria-live="polite">
          {results.length ? `${results.length} ${results.length === 1 ? 'destination' : 'destinations'}` : 'No matches'}
          {query && ` for “${query}”`}
        </p>

        {!results.length ? (
          <div className="empty">
            <h3>We haven’t mapped that one yet</h3>
            <p>Try another place name, or browse a different collection.</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setQuery(''); setCategory('all'); }}>
              Show all destinations
            </button>
          </div>
        ) : (
          <div className="dest-grid">
            {results.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} matchesMood={d.moods.slice(0, 2).includes(mood.id)} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
