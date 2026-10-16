export default function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={light ? '#FFFFFF' : '#1A73E8'} />
        <path d="M8 22c4-8 10-2 16-12" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="1 4" />
        <circle cx="8" cy="22" r="3" fill="#12B5A6" />
        <circle cx="24" cy="10" r="3" fill={light ? '#1A73E8' : '#FF8A3D'} />
      </svg>
      <span className="logo__text">
        AI Travel Planner
        <small>Plan smarter, travel better</small>
      </span>
    </span>
  );
}
