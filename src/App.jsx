import { useCallback, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureStrip from './components/FeatureStrip';
import Discover from './components/Discover';
import Trending from './components/Trending';
import TravelModes from './components/TravelModes';
import SmartRoutes from './components/SmartRoutes';
import DestinationModal from './components/DestinationModal';
import TripBuilder from './components/TripBuilder';
import PlanningOverlay from './components/PlanningOverlay';
import ItineraryDashboard from './components/ItineraryDashboard';
import MyJourneys from './components/MyJourneys';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AISettings from './components/AISettings';
import { MOODS } from './data/options';
import { PROVIDERS } from './ai/config';
import { planWithAI } from './ai/aiPlanner';
import { useJourneys } from './hooks/useJourneys';
import { useToast } from './hooks/useToast';
import { useAISettings } from './hooks/useAISettings';
import { addDays, today } from './utils/format';
import { generateItinerary } from './utils/planner';
import { scrollToId } from './utils/scroll';

const initialPrefs = () => ({
  destinationId: '',
  startCity: '',
  flexible: false,
  tripType: 'round',
  travelMode: 'flight',
  startDate: addDays(today(), 21),
  endDate: addDays(today(), 24),
  duration: 'short',
  group: 'couple',
  travellers: 2,
  interests: [],
  budgetLimit: 100000,
  currency: 'INR',
  tier: 'balanced',
  pace: 'balanced',
});

export default function App() {
  const [moodId, setMoodId] = useState('nature');
  const [prefs, setPrefs] = useState(initialPrefs);
  const [step, setStep] = useState(0);
  const [planning, setPlanning] = useState(null); // { done, label }
  const [trip, setTrip] = useState(null);
  const [openDestination, setOpenDestination] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const pending = useRef(null);
  const controller = useRef(null);
  const { journeys, save, remove, restoreSamples } = useJourneys();
  const { toast, show, dismiss } = useToast();
  const ai = useAISettings();

  const mood = MOODS.find((m) => m.id === moodId);
  const provider = PROVIDERS[ai.settings.provider];
  const aiLabel = ai.ready ? provider.short : 'Demo';
  const aiLong = ai.ready ? `${provider.short} · ${ai.settings.models[ai.settings.provider]}` : '';

  const selectMood = (id) => {
    setMoodId(id);
    const m = MOODS.find((x) => x.id === id);
    // Pre-fill the builder's interests if the traveller hasn't chosen any yet.
    setPrefs((p) => (p.interests.length ? p : { ...p, interests: m.interests }));
  };

  const planDestination = useCallback((destinationId) => {
    setOpenDestination(null);
    setPrefs((p) => ({ ...p, destinationId, flexible: false }));
    setStep(0);
    setTimeout(() => scrollToId('plan'), 60);
  }, []);

  const startPlanning = async () => {
    const snapshot = { ...prefs, interests: prefs.interests.length ? prefs.interests : mood.interests };
    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;
    pending.current = null;
    setPlanning({ done: false, prefs: snapshot });

    let result;
    let notice = '';
    if (ai.ready) {
      try {
        result = await planWithAI(snapshot, ai.settings, ctrl.signal);
      } catch (err) {
        if (ctrl.signal.aborted) return;
        notice = `${err.message || 'AI request failed.'} Showing a sample itinerary instead.`;
      }
    }
    if (ctrl.signal.aborted) return;
    if (!result) result = { ...generateItinerary(snapshot), source: 'demo' };
    pending.current = { trip: result, notice };
    setPlanning((p) => (p ? { ...p, done: true } : p));
  };

  const finishPlanning = () => {
    const { trip: next, notice } = pending.current || {};
    setPlanning(null);
    if (!next) return;
    setTrip(next);
    if (notice) show(notice);
    setTimeout(() => scrollToId('itinerary'), 80);
  };

  const cancelPlanning = () => {
    controller.current?.abort();
    setPlanning(null);
    show('Planning cancelled');
  };

  const openJourney = (journey) => {
    setTrip(journey);
    setTimeout(() => scrollToId('itinerary'), 60);
  };

  const saveTrip = (t, status) => {
    save(t, status);
    show(status === 'draft' ? 'Saved to your drafts' : 'Added to upcoming trips', 'success');
  };

  const goToBuilder = (s) => {
    if (typeof s === 'number') setStep(s);
    scrollToId('plan');
  };

  return (
    <div className="app" style={{ '--accent': mood.accent, '--accent-soft': mood.soft }}>
      <Navbar onStart={() => goToBuilder()} onOpenAI={() => setShowAI(true)} aiLabel={aiLabel} aiReady={ai.ready} />
      <main>
        <Hero prefs={prefs} setPrefs={setPrefs} mood={mood} onMood={selectMood} onGenerate={startPlanning} onCustomise={() => goToBuilder(0)} aiLabel={aiLabel === 'Demo' ? 'AI' : aiLabel} />
        <FeatureStrip onStep={setStep} />
        <Discover mood={mood} onOpen={setOpenDestination} />
        <Trending onOpen={setOpenDestination} />
        <TravelModes value={prefs.travelMode} onChange={(travelMode) => setPrefs((p) => ({ ...p, travelMode }))} />
        <SmartRoutes prefs={prefs} setPrefs={setPrefs} onPlan={() => goToBuilder(1)} />
        <TripBuilder prefs={prefs} setPrefs={setPrefs} step={step} setStep={setStep} mood={mood} onCreate={startPlanning} aiLong={aiLong} onOpenAI={() => setShowAI(true)} />
        {trip && (
          <ItineraryDashboard
            key={trip.id}
            trip={trip}
            setTrip={setTrip}
            onSave={saveTrip}
            isSaved={journeys.some((j) => j.id === trip.id)}
            notify={show}
            ai={ai}
            aiLabel={aiLabel}
            onEditPreferences={() => {
              setPrefs((p) => ({ ...p, ...pickPrefs(trip) }));
              setStep(0);
              scrollToId('plan');
            }}
          />
        )}
        <MyJourneys journeys={journeys} onOpen={openJourney} onRemove={(id) => { remove(id); show('Trip removed'); }} onRestore={restoreSamples} onPlan={() => goToBuilder()} activeId={trip?.id} />
        <FinalCTA onPlan={() => goToBuilder(0)} />
      </main>
      <Footer />
      {openDestination && <DestinationModal destination={openDestination} onClose={() => setOpenDestination(null)} onPlan={planDestination} />}
      {planning && <PlanningOverlay prefs={planning.prefs} done={planning.done} providerLabel={ai.ready ? provider.short : ''} onFinish={finishPlanning} onCancel={cancelPlanning} />}
      {showAI && (
        <AISettings
          settings={ai.settings}
          onSave={(s) => {
            ai.setSettings(s);
            show(s.provider === 'demo' ? 'AI settings saved' : `Using ${PROVIDERS[s.provider].short} (${s.models[s.provider]})`, 'success');
          }}
          onClose={() => setShowAI(false)}
        />
      )}
      <Toast toast={toast} onClose={dismiss} />
    </div>
  );
}

function pickPrefs(trip) {
  const { destinationId, startCity, startDate, endDate, group, travellers, interests, budgetLimit, currency, tier, pace, travelMode = 'flight', tripType = 'round' } = trip;
  return { destinationId, startCity, startDate, endDate, group, travellers, interests, budgetLimit, currency, tier, pace, travelMode, tripType, flexible: false };
}
