import { addDays, today } from '../utils/format';

// Sample saved journeys shown on first visit. Itineraries are generated from
// these preferences by the simulated planner when the page loads.
export function sampleJourneyPrefs() {
  const t = today();
  return [
    {
      status: 'upcoming',
      sample: true,
      destinationId: 'munnar',
      startCity: 'Kochi',
      startDate: addDays(t, 24),
      endDate: addDays(t, 27),
      group: 'couple',
      travellers: 2,
      interests: ['nature', 'food'],
      budgetLimit: 45000,
      currency: 'INR',
      tier: 'balanced',
      pace: 'relaxed',
    },
    {
      status: 'draft',
      sample: true,
      destinationId: 'jaipur',
      startCity: 'Delhi',
      startDate: addDays(t, 61),
      endDate: addDays(t, 64),
      group: 'friends',
      travellers: 4,
      interests: ['culture', 'food', 'shopping'],
      budgetLimit: 90000,
      currency: 'INR',
      tier: 'budget',
      pace: 'packed',
    },
    {
      status: 'past',
      sample: true,
      destinationId: 'goa',
      startCity: 'Mumbai',
      startDate: addDays(t, -48),
      endDate: addDays(t, -45),
      group: 'friends',
      travellers: 3,
      interests: ['relax', 'food'],
      budgetLimit: 70000,
      currency: 'INR',
      tier: 'balanced',
      pace: 'balanced',
    },
  ];
}
