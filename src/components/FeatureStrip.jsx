import { MdOutlineAutoAwesome, MdOutlineRoute, MdOutlineHotel, MdOutlineAttractions, MdOutlineSavings, MdOutlineTipsAndUpdates } from 'react-icons/md';
import { scrollToId } from '../utils/scroll';
import './FeatureStrip.css';

const FEATURES = [
  { icon: MdOutlineAutoAwesome, title: 'AI Itinerary', text: 'Personalised plans in seconds', color: '#1A73E8', target: 'plan' },
  { icon: MdOutlineRoute, title: 'Best Routes', text: 'All transport modes in one plan', color: '#12B5A6', target: 'routes' },
  { icon: MdOutlineHotel, title: 'Hotels & Stays', text: 'Curated stays for every budget', color: '#FF8A3D', target: 'plan', step: 4 },
  { icon: MdOutlineAttractions, title: 'Attractions', text: 'Top places & local experiences', color: '#E5484D', target: 'discover' },
  { icon: MdOutlineSavings, title: 'Budget Planning', text: 'Cost estimates and money tips', color: '#F5A623', target: 'plan', step: 4 },
  { icon: MdOutlineTipsAndUpdates, title: 'Travel Tips', text: 'Local insights & travel guides', color: '#7C5CFC', target: 'modes' },
];

export default function FeatureStrip({ onStep }) {
  return (
    <section className="features" aria-label="What the planner does">
      <div className="container">
        <ul className="features__grid">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.title}>
                <button
                  className="feature"
                  style={{ '--f': f.color }}
                  onClick={() => {
                    if (f.step !== undefined) onStep(f.step);
                    scrollToId(f.target);
                  }}
                >
                  <span className="feature__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <strong>{f.title}</strong>
                  <small>{f.text}</small>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
