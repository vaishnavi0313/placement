import { FiFeather, FiCoffee, FiCompass, FiSun, FiMapPin, FiShoppingBag, FiBookOpen } from 'react-icons/fi';
import { TbMountain } from 'react-icons/tb';
import { MdFlight, MdTrain, MdDirectionsBus, MdDirectionsCar, MdDirectionsBoat, MdSubway, MdLocalTaxi } from 'react-icons/md';

// Travel moods drive recommendations and the page accent colour.
export const MOODS = [
  { id: 'nature', label: 'Nature Escape', icon: TbMountain, accent: '#12B5A6', soft: '#DDF5F2', interests: ['nature'], note: 'Misty hills, forests & quiet trails' },
  { id: 'food', label: 'Food & Culture', icon: FiCoffee, accent: '#FF8A3D', soft: '#FFEBDD', interests: ['food', 'culture'], note: 'Markets, kitchens & old quarters' },
  { id: 'adventure', label: 'Adventure', icon: FiCompass, accent: '#E5484D', soft: '#FCE3E4', interests: ['adventure'], note: 'Summits, surf & sunrise treks' },
  { id: 'relax', label: 'Relaxing Getaway', icon: FiSun, accent: '#F5A623', soft: '#FEF1DA', interests: ['relax'], note: 'Slow mornings & lakeside evenings' },
  { id: 'city', label: 'City Explorer', icon: FiMapPin, accent: '#1A73E8', soft: '#E3EEFD', interests: ['culture', 'shopping'], note: 'Bazaars, palaces & café streets' },
];

export const PERSONALITIES = [
  { id: 'nature', label: 'Nature lover', icon: TbMountain },
  { id: 'food', label: 'Food explorer', icon: FiCoffee },
  { id: 'culture', label: 'Culture enthusiast', icon: FiBookOpen },
  { id: 'adventure', label: 'Adventure seeker', icon: FiCompass },
  { id: 'relax', label: 'Relaxation enthusiast', icon: FiFeather },
  { id: 'shopping', label: 'Shopping lover', icon: FiShoppingBag },
];

export const GROUPS = [
  { id: 'solo', label: 'Solo', hint: 'Just me', min: 1, max: 1, default: 1 },
  { id: 'couple', label: 'Couple', hint: 'Two of us', min: 2, max: 2, default: 2 },
  { id: 'friends', label: 'Friends', hint: 'The whole gang', min: 2, max: 12, default: 4 },
  { id: 'family', label: 'Family', hint: 'Kids & grandparents welcome', min: 2, max: 12, default: 4 },
];

export const PACES = [
  { id: 'relaxed', label: 'Slow & relaxed', perDay: 2, hint: 'Two highlights a day, long lunches, early nights.' },
  { id: 'balanced', label: 'Balanced exploration', perDay: 3, hint: 'A comfortable mix of sights and downtime.' },
  { id: 'packed', label: 'Packed adventure', perDay: 4, hint: 'Early starts and as much as each day can hold.' },
];

export const TIERS = [
  { id: 'budget', label: 'Budget', hint: 'Homestays, local eateries, shared transfers', factor: 0.75 },
  { id: 'balanced', label: 'Balanced', hint: 'Comfortable hotels and a few splurges', factor: 1 },
  { id: 'comfort', label: 'Comfort', hint: 'Boutique stays and private transfers', factor: 1.6 },
];

// Illustrative, fixed conversion rates for the demo — not live exchange rates.
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', rate: 1, step: 1000, max: 600000, locale: 'en-IN' },
  { code: 'USD', symbol: '$', rate: 1 / 84, step: 25, max: 7200, locale: 'en-US' },
  { code: 'EUR', symbol: '€', rate: 1 / 91, step: 25, max: 6600, locale: 'de-DE' },
];

export const DURATIONS = [
  { id: 'weekend', label: 'A weekend', days: 2 },
  { id: 'short', label: '3–5 days', days: 4 },
  { id: 'week', label: 'One week', days: 7 },
];

export const PLANNING_MESSAGES = [
  'Understanding your travel style…',
  'Finding experiences that match your interests…',
  'Balancing your budget and travel time…',
  'Putting your journey together…',
];

export const COMPANION_CHIPS = [
  { id: 'cheaper', label: 'Make my trip cheaper' },
  { id: 'gems', label: 'Add hidden gems' },
  { id: 'relaxed', label: 'Make the schedule more relaxed' },
  { id: 'food', label: 'Find more local food' },
  { id: 'rainy', label: 'Suggest a rainy-day plan' },
];

// Travel modes. `factor` scales the indicative transport estimate for trips
// within India; international trips always assume a flight for the main leg.
export const TRAVEL_MODES = [
  { id: 'flight', label: 'Flight', sub: 'Fast & convenient', icon: MdFlight, color: '#1A73E8', factor: 1.8, tip: 'Best for long distances and every international trip. Book 3–6 weeks out for better fares.' },
  { id: 'train', label: 'Train', sub: 'Scenic journeys', icon: MdTrain, color: '#12B5A6', factor: 0.8, tip: 'Great value in India and Sri Lanka; overnight sleepers save a night of hotel costs.' },
  { id: 'bus', label: 'Bus', sub: 'Budget friendly', icon: MdDirectionsBus, color: '#F5A623', factor: 0.7, tip: 'Cheapest for short hops. Choose AC sleeper buses for overnight routes.' },
  { id: 'car', label: 'Car', sub: 'Self drive / rental', icon: MdDirectionsCar, color: '#E5484D', factor: 1.1, tip: 'Most flexible for hill stations and road trips — split costs in a group.' },
  { id: 'ferry', label: 'Ferry', sub: 'Island transfers', icon: MdDirectionsBoat, color: '#0EA5E9', factor: 1, tip: 'The way to reach islands in the Maldives, Thailand and Indonesia. Check sea conditions.' },
  { id: 'metro', label: 'Metro', sub: 'City travel', icon: MdSubway, color: '#7C5CFC', factor: 1, tip: 'Fastest way around Singapore, Dubai, Delhi and Bangkok. Get a stored-value card.' },
  { id: 'local', label: 'Local Transport', sub: 'Taxis, cabs & more', icon: MdLocalTaxi, color: '#8B5CF6', factor: 1, tip: 'Tuk-tuks, autos and ride-hailing apps for the last mile.' },
];

export const TRIP_TYPES = [
  { id: 'round', label: 'Round Trip', factor: 1 },
  { id: 'oneway', label: 'One Way', factor: 0.55 },
];
