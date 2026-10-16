import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiX, FiArrowRight, FiSearch, FiCpu, FiMoreVertical } from 'react-icons/fi';
import { scrollToId } from '../utils/scroll';
import Logo from './Logo';
import './Navbar.css';

const LINKS = [
  { id: 'top', label: 'Home' },
  { id: 'discover', label: 'Destinations' },
  { id: 'plan', label: 'Travel Planner' },
  { id: 'modes', label: 'Travel Modes' },
  { id: 'journeys', label: 'My Trips' },
];

export default function Navbar({ onStart, onOpenAI, aiLabel, aiReady }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [more, setMore] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    if (!more) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !moreRef.current?.contains(e.target)) setMore(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [more]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const current = LINKS.map((l) => document.getElementById(l.id))
        .filter(Boolean)
        .filter((el) => el.getBoundingClientRect().top < 140)
        .pop();
      setActive(current?.id || '');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo" onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <Logo />
        </a>
        <nav aria-label="Primary" className="nav__links">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); go(l.id); }}>
              {l.label}
            </a>
          ))}
        </nav>
        <button
          className="icon-btn nav__search"
          aria-label="Search destinations"
          onClick={() => {
            scrollToId('discover');
            setTimeout(() => document.getElementById('dest-search')?.focus({ preventScroll: true }), 500);
          }}
        >
          <FiSearch />
        </button>
        <div className="nav__more" ref={moreRef}>
          <button className="icon-btn" aria-label="More options" aria-haspopup="menu" aria-expanded={more} onClick={() => setMore((m) => !m)}>
            <FiMoreVertical />
          </button>
          {more && (
            <div className="nav__menu" role="menu">
              <button
                role="menuitem"
                onClick={() => {
                  setMore(false);
                  onOpenAI();
                }}
              >
                <FiCpu />
                <span>
                  AI settings
                  <small>{aiLabel}</small>
                </span>
                <i className={aiReady ? 'is-ready' : ''} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-primary btn-sm nav__cta" onClick={() => { setOpen(false); onStart(); }}>
          Start Planning <FiArrowRight />
        </button>
        <button className="icon-btn nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <div className="nav__drawer" aria-hidden={!open}>
        {LINKS.map((l, i) => (
          <a key={l.id} href={`#${l.id}`} tabIndex={open ? 0 : -1} style={{ transitionDelay: `${open ? 80 + i * 60 : 0}ms` }} onClick={(e) => { e.preventDefault(); go(l.id); }}>
            {l.label}
          </a>
        ))}
        <button className="btn btn-ghost" tabIndex={open ? 0 : -1} onClick={() => { setOpen(false); onOpenAI(); }}>
          <FiCpu /> AI settings
        </button>
        <button className="btn btn-primary" tabIndex={open ? 0 : -1} onClick={() => { setOpen(false); onStart(); }}>
          Start Planning <FiArrowRight />
        </button>
      </div>
    </header>
  );
}
