import Logo from './Logo';
import { scrollToId } from '../utils/scroll';
import './Footer.css';

export default function Footer() {
  const links = [
    ['discover', 'Destinations'],
    ['plan', 'Travel Planner'],
    ['modes', 'Travel Modes'],
    ['journeys', 'My Trips'],
  ];
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo light />
        <nav aria-label="Footer">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }}>
              {label}
            </a>
          ))}
        </nav>
        <p className="footer__note">
          Prices and routes are indicative — always verify details before travelling. Photography via Unsplash and Wikimedia Commons (CC licences).
        </p>
      </div>
    </footer>
  );
}
