import { FiArrowRight, FiShield, FiZap, FiRepeat, FiHeart } from 'react-icons/fi';
import { IMAGES } from '../data/images';
import SmartImage from './SmartImage';
import './FinalCTA.css';

export default function FinalCTA({ onPlan }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta__frame">
          <SmartImage src={IMAGES.cta} alt="A traveller looking over a mountain lake" className="cta__img" />
          <div className="cta__content">
            <h2 id="cta-title">Ready for Your Next Adventure?</h2>
            <p>Your next favourite memory starts with a plan. Let AI plan your perfect trip with flights, trains, buses, cars, ferries and local transport — all in one plan.</p>
            <button className="btn btn-teal" onClick={onPlan}>
              Plan Your Next Journey <FiArrowRight />
            </button>
            <ul className="cta__badges">
              <li>
                <FiShield /> No sign-up needed
              </li>
              <li>
                <FiZap /> Claude or Gemini powered
              </li>
              <li>
                <FiRepeat /> Flexible plans
              </li>
              <li>
                <FiHeart /> Travel with confidence
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
