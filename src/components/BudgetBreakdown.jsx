import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { BUDGET_CATEGORIES } from '../utils/planner';
import { money } from '../utils/format';
import './BudgetBreakdown.css';

export default function BudgetBreakdown({ budget, limit, currency, travellers }) {
  const [hover, setHover] = useState(null);
  const over = budget.total > limit;
  const diff = Math.abs(limit - budget.total);
  const usedPct = Math.min(100, (budget.total / limit) * 100);

  return (
    <section className="budget" aria-labelledby="budget-title">
      <header className="budget__head">
        <h3 id="budget-title">Living budget</h3>
        <span className="hand">updates as you edit</span>
      </header>

      <div className="budget__total" key={budget.total}>
        <small>Estimated total</small>
        <strong>{money(budget.total, currency)}</strong>
      </div>

      <div className="budget__stack" role="img" aria-label="Budget split by category">
        {BUDGET_CATEGORIES.map((c) => {
          const v = budget.parts[c.id];
          if (!v) return null;
          return (
            <span
              key={c.id}
              style={{ flexGrow: v, background: c.color, opacity: hover && hover !== c.id ? 0.35 : 1 }}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              title={`${c.label}: ${money(v, currency)}`}
            />
          );
        })}
      </div>

      <ul className="budget__list">
        {BUDGET_CATEGORIES.map((c) => {
          const v = budget.parts[c.id];
          const pct = budget.total ? Math.round((v / budget.total) * 100) : 0;
          return (
            <li key={c.id} className={hover === c.id ? 'is-hover' : ''} onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}>
              <span className="budget__swatch" style={{ background: c.color }} aria-hidden="true" />
              <span className="budget__label">{c.label}</span>
              <span className="budget__pct">{pct}%</span>
              <span className="budget__value">{money(v, currency)}</span>
            </li>
          );
        })}
      </ul>

      <div className="budget__limit">
        <div className="budget__limit-row">
          <span>Your budget</span>
          <strong>{money(limit, currency)}</strong>
        </div>
        <div className={`budget__meter ${over ? 'is-over' : ''}`} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(usedPct)} aria-label="Budget used">
          <span style={{ width: `${usedPct}%` }} />
        </div>
        <div className={`budget__verdict ${over ? 'is-over' : ''}`}>
          <span>{over ? 'Over budget by' : 'Remaining'}</span>
          <strong>{money(diff, currency)}</strong>
        </div>
        {travellers > 1 && (
          <div className="budget__limit-row budget__pp">
            <span>Per traveller</span>
            <strong>{money(budget.perPerson, currency)}</strong>
          </div>
        )}
      </div>

      <p className="note">
        <FiInfo /> Indicative estimates for {budget.days} days / {budget.nights} {budget.nights === 1 ? 'night' : 'nights'} — not live prices.
      </p>
    </section>
  );
}
