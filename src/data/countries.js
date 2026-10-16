import { photo } from './images';

/*
 * The 15 countries around India. Compact specs expand into full destination
 * records (same shape as data/destinations.js) for the offline Demo planner.
 * With Claude or Gemini connected, itineraries for these come from the AI.
 * All prices are illustrative INR estimates — not live fares.
 *
 * spot: [title, description, tags, slot, cost, duration, imageKey, flags?]
 * flags: o = optional, g = hidden gem, i = indoor
 */

const SLOT_TIME = { morning: ['08:30', '09:30', '10:00', '07:30'], afternoon: ['13:00', '14:30', '15:00', '12:30'], evening: ['17:30', '18:30', '19:30', '17:00'] };

const SPECS = [
  {
    id: 'nepal', name: 'Nepal', short: 'Mountains & Culture', hub: 'Kathmandu', region: 'Kathmandu & Pokhara', flight: '2h',
    tagline: 'Himalayan peaks and living temples', image: photo('photo-1544735716-392fe2489ffa', 1400),
    description: 'Prayer flags over medieval squares, lakeside Pokhara and sunrise over the Annapurnas — Nepal pairs culture and mountains like nowhere else.',
    categories: ['neighbours', 'nature', 'culture'], moods: ['adventure', 'nature', 'culture'], mapTheme: 'alps', bestTime: 'Oct – Apr', idealDays: '5–8 days',
    highlights: ['Kathmandu Durbar Square', 'Sarangkot sunrise', 'Phewa Lake', 'Poon Hill trek'],
    costs: { transport: 14000, stay: { budget: 1800, balanced: 4200, comfort: 10000 }, food: 1000, local: 1800 }, nearby: ['Delhi', 'Kolkata', 'Varanasi'],
    legs: [['flight', 'Kathmandu', '2h'], ['bus', 'Pokhara', '7h'], ['car', 'Sarangkot', '40m']],
    spots: [
      ['Kathmandu Durbar Square walk', 'Pagoda temples, courtyards and the Kumari Ghar.', ['culture'], 'morning', 1200, '2.5 hrs', 'temple'],
      ['Boudhanath Stupa at dusk', 'Join the evening kora around one of the world’s largest stupas.', ['culture', 'relax'], 'evening', 500, '1.5 hrs', 'temple'],
      ['Thamel momo & thali crawl', 'Steamed momos, dal bhat and Newari snacks.', ['food'], 'afternoon', 900, '2 hrs', 'food', 'i'],
      ['Sarangkot sunrise viewpoint', 'Watch the Annapurna range turn pink at dawn.', ['nature', 'adventure'], 'morning', 800, '3 hrs', 'viewpoint'],
      ['Boating on Phewa Lake', 'Row out to the Tal Barahi island temple.', ['relax', 'nature'], 'afternoon', 700, '1.5 hrs', 'lake'],
      ['Paragliding over Pokhara', 'Tandem flight with Himalayan views.', ['adventure'], 'morning', 7500, '3 hrs', 'viewpoint', 'o'],
      ['Bhaktapur old town', 'Pottery square and the five-storey Nyatapola temple.', ['culture', 'shopping'], 'afternoon', 1500, '3 hrs', 'temple', 'g'],
    ],
  },
  {
    id: 'bhutan', name: 'Bhutan', short: 'Happiness Kingdom', hub: 'Paro', region: 'Paro, Thimphu & Punakha', flight: '2h 30m',
    tagline: 'Cliffside monasteries and quiet valleys', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Paro_Taktsang%2C_Bhutan_%28edited%29.jpg/1280px-Paro_Taktsang%2C_Bhutan_%28edited%29.jpg',
    description: 'Dzongs above rivers, prayer wheels in every village and the Tiger’s Nest clinging to a cliff — Bhutan is unhurried and deeply serene.',
    categories: ['neighbours', 'hidden', 'culture'], moods: ['nature', 'relax', 'culture'], mapTheme: 'alps', bestTime: 'Mar – May, Sep – Nov', idealDays: '5–7 days',
    highlights: ['Tiger’s Nest Monastery', 'Punakha Dzong', 'Dochula Pass', 'Thimphu weekend market'],
    costs: { transport: 22000, stay: { budget: 3500, balanced: 7000, comfort: 16000 }, food: 1400, local: 4500 }, nearby: ['Delhi', 'Kolkata', 'Bagdogra'],
    legs: [['flight', 'Paro', '2h 30m'], ['car', 'Thimphu', '1h'], ['car', 'Punakha', '3h']],
    spots: [
      ['Hike to Tiger’s Nest (Paro Taktsang)', 'A steep forest trail to the iconic cliffside monastery.', ['adventure', 'culture'], 'morning', 1500, '5 hrs', 'hike'],
      ['Punakha Dzong', 'A fortress-monastery at the meeting of two rivers.', ['culture'], 'afternoon', 600, '2 hrs', 'temple'],
      ['Dochula Pass & 108 chortens', 'Himalayan panorama from a mountain pass.', ['nature'], 'morning', 0, '1 hr', 'viewpoint'],
      ['Thimphu weekend market', 'Chillies, cheese and handicrafts.', ['shopping', 'food'], 'afternoon', 500, '1.5 hrs', 'market'],
      ['Ema datshi cooking session', 'Learn Bhutan’s chilli-cheese national dish.', ['food', 'culture'], 'evening', 1800, '2 hrs', 'food', 'i'],
      ['Hot stone bath', 'A traditional farmhouse river-stone soak.', ['relax'], 'evening', 2500, '1.5 hrs', 'spa', 'o'],
      ['Chele La pass walk', 'The highest motorable road, prayer flags and views.', ['nature', 'adventure'], 'morning', 800, '3 hrs', 'viewpoint', 'g'],
    ],
  },
  {
    id: 'bangladesh', name: 'Bangladesh', short: 'Rivers & Heritage', hub: 'Dhaka', region: 'Dhaka, Sylhet & Sundarbans', flight: '2h 30m',
    tagline: 'River life, tea hills and mangroves', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg',
    description: 'Rickshaw-filled old Dhaka, the tea gardens of Sylhet and boat journeys into the Sundarbans make for a rewarding, less-travelled trip.',
    categories: ['neighbours', 'hidden', 'nature'], moods: ['culture', 'nature', 'food'], mapTheme: 'coast', bestTime: 'Nov – Feb', idealDays: '4–6 days',
    highlights: ['Old Dhaka & Lalbagh Fort', 'Sundarbans mangroves', 'Sreemangal tea gardens', 'Ratargul swamp forest'],
    costs: { transport: 12000, stay: { budget: 1500, balanced: 3500, comfort: 8000 }, food: 800, local: 1400 }, nearby: ['Kolkata', 'Chennai', 'Delhi'],
    legs: [['flight', 'Dhaka', '2h 30m'], ['train', 'Sreemangal', '4h'], ['ferry', 'Sundarbans', '5h']],
    spots: [
      ['Old Dhaka rickshaw tour', 'Ahsan Manzil, Sadarghat river port and Armenian Church.', ['culture'], 'morning', 900, '3 hrs', 'city'],
      ['Lalbagh Fort', 'An unfinished 17th-century Mughal fort.', ['culture'], 'afternoon', 300, '1.5 hrs', 'fort'],
      ['Biryani at old-city kitchens', 'Kacchi biryani and borhani.', ['food'], 'evening', 600, '1.5 hrs', 'food', 'i'],
      ['Sreemangal tea garden walk', 'Rolling tea estates and the seven-layer tea.', ['nature', 'food'], 'morning', 700, '3 hrs', 'tea'],
      ['Lawachara rainforest trail', 'Gibbons and birdlife in a protected forest.', ['nature', 'adventure'], 'afternoon', 600, '2.5 hrs', 'forest'],
      ['Sundarbans boat safari', 'Mangrove channels — home of the Bengal tiger.', ['nature', 'adventure'], 'morning', 6000, '8 hrs', 'lake', 'o'],
      ['Ratargul swamp forest', 'Row through a flooded forest.', ['nature'], 'afternoon', 900, '2 hrs', 'forest', 'g'],
    ],
  },
  {
    id: 'srilanka', name: 'Sri Lanka', short: 'Beaches & History', hub: 'Colombo', region: 'Kandy, Ella & the south coast', flight: '1h 30m',
    tagline: 'Tea trains, temples and golden coasts', image: photo('photo-1566296314736-6eaac1ca0cb9', 1400),
    description: 'Ride the hill-country train past tea estates, climb Sigiriya rock and finish on palm-fringed southern beaches.',
    categories: ['neighbours', 'islands', 'nature', 'culture'], moods: ['nature', 'relax', 'culture'], mapTheme: 'island', bestTime: 'Dec – Apr', idealDays: '6–9 days',
    highlights: ['Sigiriya Rock Fortress', 'Kandy–Ella train', 'Galle Fort', 'Mirissa beach'],
    costs: { transport: 16000, stay: { budget: 2200, balanced: 5500, comfort: 13000 }, food: 1200, local: 2200 }, nearby: ['Chennai', 'Kochi', 'Bengaluru', 'Madurai'],
    legs: [['flight', 'Colombo', '1h 30m'], ['train', 'Kandy', '3h'], ['train', 'Ella', '7h'], ['car', 'Mirissa', '4h']],
    spots: [
      ['Temple of the Tooth, Kandy', 'Sri Lanka’s most sacred Buddhist shrine.', ['culture'], 'evening', 1000, '1.5 hrs', 'temple'],
      ['Climb Sigiriya Rock', 'Frescoes, lion paws and a summit palace.', ['adventure', 'culture'], 'morning', 2700, '3 hrs', 'fort'],
      ['Kandy–Ella scenic train', 'One of the world’s prettiest rail journeys.', ['nature', 'relax'], 'morning', 600, '7 hrs', 'train'],
      ['Nine Arch Bridge & Little Adam’s Peak', 'Colonial viaduct and an easy summit hike.', ['nature', 'adventure'], 'afternoon', 0, '3 hrs', 'hike'],
      ['Galle Fort sunset walk', 'Ramparts, lighthouses and boutique cafés.', ['culture', 'shopping'], 'evening', 300, '2 hrs', 'fort'],
      ['Mirissa whale watching', 'Blue whales and dolphins at sea.', ['nature', 'adventure'], 'morning', 4500, '4 hrs', 'beach', 'o'],
      ['Rice & curry home lunch', 'A dozen small curries with a local family.', ['food'], 'afternoon', 900, '1.5 hrs', 'indianFood', 'gi'],
    ],
  },
  {
    id: 'maldives', name: 'Maldives', short: 'Island Paradise', hub: 'Malé', region: 'Malé & the atolls', flight: '1h 30m',
    tagline: 'Overwater villas and coral lagoons', image: photo('photo-1514282401047-d79a71a590e8', 1400),
    description: 'Turquoise lagoons, house reefs and sandbank picnics. Local islands make the Maldives possible on a sensible budget too.',
    categories: ['neighbours', 'islands'], moods: ['relax', 'adventure'], mapTheme: 'island', bestTime: 'Nov – Apr', idealDays: '4–6 days',
    highlights: ['House-reef snorkelling', 'Sandbank picnic', 'Maafushi local island', 'Bioluminescent beaches'],
    costs: { transport: 24000, stay: { budget: 4500, balanced: 12000, comfort: 35000 }, food: 2200, local: 3500 }, nearby: ['Kochi', 'Bengaluru', 'Chennai', 'Mumbai'],
    legs: [['flight', 'Malé', '1h 30m'], ['ferry', 'Maafushi', '1h 30m'], ['ferry', 'Sandbank', '20m']],
    spots: [
      ['House-reef snorkelling', 'Turtles, reef sharks and parrotfish right off the beach.', ['adventure', 'nature'], 'morning', 1500, '2 hrs', 'dive'],
      ['Sunset dolphin cruise', 'Spinner dolphins at golden hour.', ['nature', 'relax'], 'evening', 3500, '2 hrs', 'sunset'],
      ['Sandbank picnic', 'A strip of sand in the middle of the ocean.', ['relax'], 'afternoon', 4000, '3 hrs', 'beach'],
      ['Malé fish market & mosque', 'The capital’s bustling market and coral-stone Old Friday Mosque.', ['culture', 'food'], 'morning', 300, '2 hrs', 'market'],
      ['Scuba discovery dive', 'Try diving with an instructor.', ['adventure'], 'morning', 9000, '3 hrs', 'dive', 'o'],
      ['Overwater spa session', 'Massage above the lagoon.', ['relax'], 'afternoon', 7000, '1.5 hrs', 'spa', 'oi'],
      ['Night bioluminescence walk', 'Glowing plankton on the shore (seasonal).', ['nature'], 'evening', 0, '1 hr', 'beach', 'g'],
    ],
  },
  {
    id: 'thailand', name: 'Thailand', short: 'Temples & Islands', hub: 'Bangkok', region: 'Bangkok, Chiang Mai & Krabi', flight: '4h',
    tagline: 'Golden temples and limestone islands', image: photo('photo-1528181304800-259b08848526', 1400),
    description: 'Street food in Bangkok, temples in Chiang Mai and long-tail boats around Krabi’s limestone islands.',
    categories: ['neighbours', 'islands', 'culture'], moods: ['food', 'relax', 'adventure', 'city'], mapTheme: 'coast', bestTime: 'Nov – Mar', idealDays: '6–9 days',
    highlights: ['Grand Palace & Wat Pho', 'Chiang Mai old city', 'Phi Phi Islands', 'Floating markets'],
    costs: { transport: 22000, stay: { budget: 2200, balanced: 5500, comfort: 13000 }, food: 1400, local: 2000 }, nearby: ['Kolkata', 'Delhi', 'Mumbai', 'Chennai', 'Bengaluru'],
    legs: [['flight', 'Bangkok', '4h'], ['train', 'Chiang Mai', '11h'], ['flight', 'Krabi', '2h'], ['ferry', 'Phi Phi', '2h']],
    spots: [
      ['Grand Palace & Wat Pho', 'The Emerald Buddha and the giant reclining Buddha.', ['culture'], 'morning', 1500, '3 hrs', 'temple'],
      ['Chinatown street-food night', 'Pad thai, mango sticky rice and boat noodles.', ['food'], 'evening', 900, '2.5 hrs', 'food'],
      ['Damnoen Saduak floating market', 'Boat vendors and canal life.', ['shopping', 'food'], 'morning', 1800, '4 hrs', 'market', 'o'],
      ['Doi Suthep temple, Chiang Mai', 'A golden mountain-top temple above the city.', ['culture', 'nature'], 'afternoon', 600, '3 hrs', 'temple'],
      ['Phi Phi island-hopping', 'Maya Bay, lagoons and snorkelling stops.', ['adventure', 'nature'], 'morning', 3500, '7 hrs', 'beach'],
      ['Thai massage', 'Traditional massage at a local school.', ['relax'], 'afternoon', 900, '1.5 hrs', 'spa', 'i'],
      ['Railay beach sunset', 'Cliffs, climbers and a perfect sunset.', ['relax', 'nature'], 'evening', 300, '2 hrs', 'sunset', 'g'],
    ],
  },
  {
    id: 'singapore', name: 'Singapore', short: 'Modern City', hub: 'Singapore', region: 'Marina Bay & Sentosa', flight: '4h 30m',
    tagline: 'Garden city of skylines and hawker stalls', image: photo('photo-1525625293386-3f8f99389edd', 1400),
    description: 'Supertrees, rooftop views and Michelin-starred hawker food — Singapore is clean, easy and endlessly fun for families.',
    categories: ['neighbours', 'city'], moods: ['city', 'food'], mapTheme: 'coast', bestTime: 'Feb – Apr', idealDays: '3–5 days',
    highlights: ['Gardens by the Bay', 'Marina Bay Sands', 'Sentosa Island', 'Hawker centres'],
    costs: { transport: 24000, stay: { budget: 5500, balanced: 11000, comfort: 24000 }, food: 2200, local: 1800 }, nearby: ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Kochi'],
    legs: [['flight', 'Singapore', '4h 30m'], ['metro', 'Marina Bay', '30m'], ['metro', 'Sentosa', '25m']],
    spots: [
      ['Gardens by the Bay & Supertree show', 'Cloud Forest dome and the evening light show.', ['nature'], 'evening', 3200, '3 hrs', 'garden'],
      ['Hawker centre lunch', 'Chicken rice, laksa and satay.', ['food'], 'afternoon', 600, '1.5 hrs', 'food', 'i'],
      ['Little India & Kampong Glam', 'Colourful shophouses, Sultan Mosque and Haji Lane.', ['culture', 'shopping'], 'morning', 0, '3 hrs', 'city'],
      ['Sentosa beaches & cable car', 'Island fun with skyline views.', ['relax', 'adventure'], 'afternoon', 2500, '4 hrs', 'beach'],
      ['Universal Studios Singapore', 'A full day of rides and shows.', ['adventure'], 'morning', 6500, '7 hrs', 'city', 'o'],
      ['Night Safari', 'Wildlife after dark by tram.', ['nature', 'adventure'], 'evening', 3600, '3 hrs', 'forest', 'o'],
      ['Southern Ridges walk', 'Canopy walkways and the Henderson Waves bridge.', ['nature'], 'morning', 0, '2.5 hrs', 'forest', 'g'],
    ],
  },
  {
    id: 'malaysia', name: 'Malaysia', short: 'Culture & Nature', hub: 'Kuala Lumpur', region: 'Kuala Lumpur, Penang & Langkawi', flight: '4h',
    tagline: 'Twin towers, street art and rainforest', image: photo('photo-1596422846543-75c6fc197f07', 1400),
    description: 'From the Petronas Towers to Penang’s street art and Langkawi’s sky bridge, Malaysia mixes cultures and landscapes effortlessly.',
    categories: ['neighbours', 'city', 'nature'], moods: ['city', 'food', 'nature'], mapTheme: 'hills', bestTime: 'Dec – Apr', idealDays: '5–7 days',
    highlights: ['Petronas Towers', 'Batu Caves', 'George Town street art', 'Langkawi Sky Bridge'],
    costs: { transport: 20000, stay: { budget: 2500, balanced: 6000, comfort: 14000 }, food: 1300, local: 1700 }, nearby: ['Chennai', 'Kochi', 'Bengaluru', 'Hyderabad'],
    legs: [['flight', 'Kuala Lumpur', '4h'], ['train', 'Penang', '4h'], ['ferry', 'Langkawi', '3h']],
    spots: [
      ['Petronas Towers skybridge', 'The iconic twin towers, up close.', ['city', 'culture'], 'morning', 2200, '2 hrs', 'city'],
      ['Batu Caves', 'A giant golden statue and 272 colourful steps.', ['culture', 'adventure'], 'morning', 0, '2.5 hrs', 'temple'],
      ['Jalan Alor night food street', 'Satay, char kway teow and durian.', ['food'], 'evening', 800, '2 hrs', 'food'],
      ['George Town street-art trail', 'Murals, clan houses and heritage cafés.', ['culture', 'shopping'], 'afternoon', 0, '3 hrs', 'city'],
      ['Langkawi Sky Bridge & cable car', 'A curved bridge high above the rainforest.', ['nature', 'adventure'], 'morning', 2400, '3 hrs', 'viewpoint'],
      ['Mangrove kayaking, Langkawi', 'Paddle through limestone mangroves.', ['nature', 'adventure'], 'afternoon', 3000, '3 hrs', 'lake', 'o'],
      ['Cameron Highlands tea estates', 'Cool hills and strawberry farms.', ['nature', 'food'], 'morning', 1500, '5 hrs', 'tea', 'g'],
    ],
  },
  {
    id: 'vietnam', name: 'Vietnam', short: 'Nature & Heritage', hub: 'Hanoi', region: 'Hanoi, Ha Long Bay & Hoi An', flight: '5h',
    tagline: 'Emerald bays and lantern-lit towns', image: photo('photo-1528127269322-539801943592', 1400),
    description: 'Cruise among Ha Long Bay’s karsts, slurp pho in Hanoi and wander lantern-lit Hoi An — great value and great food.',
    categories: ['neighbours', 'nature', 'culture'], moods: ['food', 'nature', 'culture'], mapTheme: 'coast', bestTime: 'Feb – Apr, Aug – Oct', idealDays: '6–9 days',
    highlights: ['Ha Long Bay cruise', 'Hanoi Old Quarter', 'Hoi An Ancient Town', 'Ninh Binh'],
    costs: { transport: 26000, stay: { budget: 1800, balanced: 4500, comfort: 11000 }, food: 1000, local: 1800 }, nearby: ['Delhi', 'Mumbai', 'Kolkata'],
    legs: [['flight', 'Hanoi', '5h'], ['bus', 'Ha Long Bay', '3h'], ['flight', 'Da Nang', '1h 20m'], ['car', 'Hoi An', '45m']],
    spots: [
      ['Hanoi Old Quarter food walk', 'Pho, bún chả and egg coffee.', ['food', 'culture'], 'evening', 1200, '3 hrs', 'food'],
      ['Ha Long Bay overnight cruise', 'Kayak among limestone islands and caves.', ['nature', 'adventure'], 'morning', 9000, '1 day', 'lake'],
      ['Hoi An lantern-lit old town', 'Tailors, lanterns and the Japanese Bridge.', ['culture', 'shopping'], 'evening', 600, '3 hrs', 'city'],
      ['Ninh Binh boat ride', 'Rice fields and river caves at Tam Coc.', ['nature'], 'morning', 1800, '4 hrs', 'rice'],
      ['Temple of Literature', 'Vietnam’s first university, built in 1070.', ['culture'], 'morning', 200, '1.5 hrs', 'temple', 'i'],
      ['Ba Na Hills & Golden Bridge', 'The giant-hands bridge in the clouds.', ['adventure'], 'morning', 5000, '6 hrs', 'viewpoint', 'o'],
      ['An Bang beach afternoon', 'A laid-back beach near Hoi An.', ['relax'], 'afternoon', 300, '3 hrs', 'beach', 'g'],
    ],
  },
  {
    id: 'cambodia', name: 'Cambodia', short: 'Ancient Wonders', hub: 'Siem Reap', region: 'Siem Reap & Phnom Penh', flight: '6h',
    tagline: 'Angkor sunrises and riverside capitals', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Angkor_Wat_Sunrise_%28209237385%29.jpeg/1280px-Angkor_Wat_Sunrise_%28209237385%29.jpeg',
    description: 'Sunrise at Angkor Wat, jungle-wrapped Ta Prohm and riverside Phnom Penh — Cambodia is history on an epic scale.',
    categories: ['neighbours', 'culture', 'hidden'], moods: ['culture', 'adventure'], mapTheme: 'hills', bestTime: 'Nov – Mar', idealDays: '4–6 days',
    highlights: ['Angkor Wat sunrise', 'Ta Prohm', 'Bayon faces', 'Tonlé Sap floating villages'],
    costs: { transport: 30000, stay: { budget: 1800, balanced: 4200, comfort: 10000 }, food: 1000, local: 1800 }, nearby: ['Delhi', 'Kolkata', 'Mumbai'],
    legs: [['flight', 'Siem Reap', '6h'], ['local', 'Angkor Park', '20m'], ['bus', 'Phnom Penh', '6h']],
    spots: [
      ['Angkor Wat sunrise', 'Watch the towers emerge from the dawn sky.', ['culture', 'nature'], 'morning', 3100, '4 hrs', 'temple'],
      ['Ta Prohm & Bayon', 'Tree-strangled ruins and 200 stone faces.', ['culture', 'adventure'], 'afternoon', 0, '3 hrs', 'temple'],
      ['Pub Street & night market', 'Khmer amok and street snacks.', ['food', 'shopping'], 'evening', 800, '2 hrs', 'market'],
      ['Tonlé Sap floating village', 'Stilt houses on Southeast Asia’s largest lake.', ['nature', 'culture'], 'afternoon', 2000, '3 hrs', 'lake', 'o'],
      ['Apsara dance dinner', 'Classical Khmer dance with a buffet.', ['culture', 'food'], 'evening', 1800, '2 hrs', 'museum', 'i'],
      ['Banteay Srei pink temple', 'Exquisite carvings in pink sandstone.', ['culture'], 'morning', 0, '3 hrs', 'temple', 'g'],
      ['Royal Palace, Phnom Penh', 'Silver Pagoda and riverside promenade.', ['culture'], 'morning', 800, '2 hrs', 'temple'],
    ],
  },
  {
    id: 'laos', name: 'Laos', short: 'Peaceful Landscapes', hub: 'Luang Prabang', region: 'Luang Prabang & Vang Vieng', flight: '6h',
    tagline: 'Saffron robes and turquoise waterfalls', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Kuang_Si_Falls_and_a_turquoise_water_pool_in_Luang_Prabang_province_Laos.jpg/1280px-Kuang_Si_Falls_and_a_turquoise_water_pool_in_Luang_Prabang_province_Laos.jpg',
    description: 'Monks at dawn, the turquoise Kuang Si falls and karst valleys in Vang Vieng — Laos is Southeast Asia at its most relaxed.',
    categories: ['neighbours', 'hidden', 'nature'], moods: ['relax', 'nature', 'adventure'], mapTheme: 'hills', bestTime: 'Nov – Mar', idealDays: '4–6 days',
    highlights: ['Kuang Si Falls', 'Alms-giving ceremony', 'Mekong sunset', 'Vang Vieng lagoons'],
    costs: { transport: 32000, stay: { budget: 1600, balanced: 4000, comfort: 9500 }, food: 900, local: 1600 }, nearby: ['Delhi', 'Kolkata'],
    legs: [['flight', 'Luang Prabang', '6h'], ['train', 'Vang Vieng', '1h'], ['local', 'Blue Lagoon', '30m']],
    spots: [
      ['Tak bat alms ceremony', 'Monks collect alms at sunrise — watch respectfully.', ['culture'], 'morning', 0, '1 hr', 'temple'],
      ['Kuang Si Falls', 'Turquoise tiered pools in the jungle.', ['nature', 'adventure'], 'afternoon', 900, '4 hrs', 'waterfall'],
      ['Mount Phousi sunset', 'Climb to a golden stupa over the Mekong.', ['nature', 'relax'], 'evening', 300, '1.5 hrs', 'sunset'],
      ['Night market & Lao food', 'Laap, sticky rice and khao soi.', ['food', 'shopping'], 'evening', 600, '2 hrs', 'market'],
      ['Mekong slow-boat to Pak Ou caves', 'Caves filled with thousands of Buddha images.', ['culture', 'nature'], 'morning', 1500, '4 hrs', 'lake', 'o'],
      ['Vang Vieng tubing & lagoons', 'River tubing and the Blue Lagoon.', ['adventure'], 'afternoon', 1200, '4 hrs', 'lake'],
      ['Weaving village visit', 'Silk weaving at Ban Xang Khong.', ['culture', 'shopping'], 'afternoon', 400, '2 hrs', 'market', 'gi'],
    ],
  },
  {
    id: 'myanmar', name: 'Myanmar', short: 'Golden Pagodas', hub: 'Yangon', region: 'Yangon, Bagan & Inle Lake', flight: '3h',
    tagline: 'A plain of a thousand temples', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Temples_and_hot_air_balloons._%28Unsplash%29.jpg/1280px-Temples_and_hot_air_balloons._%28Unsplash%29.jpg',
    description: 'Shwedagon’s golden spire, balloon sunrises over Bagan and leg-rowing fishermen on Inle Lake. Check current travel advisories before planning.',
    categories: ['neighbours', 'culture', 'hidden'], moods: ['culture', 'adventure'], mapTheme: 'desert', bestTime: 'Nov – Feb', idealDays: '6–8 days',
    highlights: ['Shwedagon Pagoda', 'Bagan temples', 'Inle Lake', 'Mandalay'],
    costs: { transport: 26000, stay: { budget: 1800, balanced: 4500, comfort: 11000 }, food: 900, local: 2000 }, nearby: ['Kolkata', 'Delhi', 'Chennai'],
    legs: [['flight', 'Yangon', '3h'], ['flight', 'Bagan', '1h 20m'], ['bus', 'Inle Lake', '8h']],
    spots: [
      ['Shwedagon Pagoda at sunset', 'The glittering golden heart of Yangon.', ['culture'], 'evening', 900, '2 hrs', 'temple'],
      ['Bagan temple e-bike ride', 'Explore hundreds of ancient temples.', ['culture', 'adventure'], 'morning', 800, '4 hrs', 'temple'],
      ['Hot-air balloon over Bagan', 'Sunrise drift above the temple plain (seasonal).', ['adventure'], 'morning', 25000, '3 hrs', 'viewpoint', 'o'],
      ['Inle Lake boat day', 'Floating gardens and leg-rowing fishermen.', ['nature', 'culture'], 'morning', 1800, '6 hrs', 'lake'],
      ['Tea-shop breakfast', 'Mohinga noodle soup and sweet tea.', ['food'], 'morning', 300, '1 hr', 'food', 'i'],
      ['Bogyoke Aung San Market', 'Lacquerware, jade and longyi.', ['shopping'], 'afternoon', 0, '2 hrs', 'market'],
      ['Mount Popa monastery', 'A monastery perched on a volcanic plug.', ['culture', 'nature'], 'afternoon', 1500, '5 hrs', 'temple', 'g'],
    ],
  },
  {
    id: 'uae', name: 'UAE', short: 'Modern Marvels', hub: 'Dubai', region: 'Dubai & Abu Dhabi', flight: '3h 30m',
    tagline: 'Skyscrapers, souks and desert dunes', image: photo('photo-1512453979798-5ea266f8880c', 1400),
    description: 'Burj Khalifa views, desert safaris and the marble Sheikh Zayed Mosque — the UAE is big, bold and only a short flight away.',
    categories: ['neighbours', 'city'], moods: ['city', 'adventure', 'shopping'], mapTheme: 'desert', bestTime: 'Nov – Mar', idealDays: '4–6 days',
    highlights: ['Burj Khalifa', 'Desert safari', 'Sheikh Zayed Grand Mosque', 'Old Dubai souks'],
    costs: { transport: 20000, stay: { budget: 5000, balanced: 10000, comfort: 24000 }, food: 2200, local: 2500 }, nearby: ['Mumbai', 'Kochi', 'Delhi', 'Hyderabad', 'Chennai'],
    legs: [['flight', 'Dubai', '3h 30m'], ['metro', 'Downtown', '30m'], ['bus', 'Abu Dhabi', '2h']],
    spots: [
      ['Burj Khalifa At the Top', 'City views from the 124th floor.', ['city', 'adventure'], 'evening', 4000, '2 hrs', 'city'],
      ['Desert safari & dune bashing', 'Sunset dunes, camel ride and BBQ dinner.', ['adventure'], 'afternoon', 4500, '6 hrs', 'desert'],
      ['Old Dubai souks & abra ride', 'Gold and spice souks across the creek.', ['culture', 'shopping'], 'morning', 100, '3 hrs', 'market'],
      ['Sheikh Zayed Grand Mosque', 'A dazzling white-marble landmark in Abu Dhabi.', ['culture'], 'morning', 0, '2 hrs', 'mosque'],
      ['Dubai Mall & fountain show', 'Shopping, aquarium and the evening fountains.', ['shopping'], 'evening', 0, '3 hrs', 'city', 'i'],
      ['Museum of the Future', 'An immersive look ahead in a striking building.', ['culture'], 'afternoon', 3400, '2 hrs', 'museum', 'oi'],
      ['Al Fahidi historic quarter', 'Wind towers, galleries and Arabic coffee.', ['culture', 'food'], 'morning', 0, '2 hrs', 'city', 'g'],
    ],
  },
  {
    id: 'oman', name: 'Oman', short: 'Mountains & Deserts', hub: 'Muscat', region: 'Muscat, Nizwa & Wahiba Sands', flight: '3h',
    tagline: 'Wadis, forts and quiet desert nights', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Wadi_Shab%2C_Oman.jpg/1280px-Wadi_Shab%2C_Oman.jpg',
    description: 'Swim in emerald wadis, explore mud-brick forts and sleep under the stars in the Wahiba Sands — Oman is Arabia at its most authentic.',
    categories: ['neighbours', 'hidden', 'nature'], moods: ['adventure', 'nature', 'culture'], mapTheme: 'desert', bestTime: 'Oct – Mar', idealDays: '5–7 days',
    highlights: ['Wadi Shab', 'Nizwa Fort', 'Wahiba Sands', 'Sultan Qaboos Grand Mosque'],
    costs: { transport: 18000, stay: { budget: 4000, balanced: 8000, comfort: 18000 }, food: 1600, local: 3500 }, nearby: ['Mumbai', 'Kochi', 'Delhi', 'Hyderabad'],
    legs: [['flight', 'Muscat', '3h'], ['car', 'Wadi Shab', '2h'], ['car', 'Wahiba Sands', '2h 30m'], ['car', 'Nizwa', '3h']],
    spots: [
      ['Sultan Qaboos Grand Mosque', 'A vast chandelier and hand-woven carpet.', ['culture'], 'morning', 0, '1.5 hrs', 'mosque'],
      ['Mutrah Souk & Corniche', 'Frankincense, silver and harbour views.', ['shopping', 'culture'], 'evening', 0, '2 hrs', 'market'],
      ['Wadi Shab hike & swim', 'Turquoise pools and a hidden cave waterfall.', ['adventure', 'nature'], 'morning', 300, '4 hrs', 'waterfall'],
      ['Wahiba Sands desert camp', 'Dunes at sunset and a star-filled night.', ['adventure', 'relax'], 'evening', 6000, 'overnight', 'desert'],
      ['Nizwa Fort & Friday market', 'A 17th-century fort and livestock auction.', ['culture', 'shopping'], 'morning', 500, '3 hrs', 'fort'],
      ['Omani shuwa & halwa tasting', 'Slow-cooked lamb and rosewater halwa.', ['food'], 'afternoon', 1200, '1.5 hrs', 'food', 'i'],
      ['Jebel Shams canyon rim walk', 'Oman’s “Grand Canyon”.', ['nature', 'adventure'], 'morning', 0, '4 hrs', 'viewpoint', 'og'],
    ],
  },
];

function spread(i, n) {
  // deterministic, roughly even scatter for the schematic map
  const angle = (i / n) * Math.PI * 2 + 0.6;
  const r = 22 + (i % 3) * 9;
  return { x: Math.round(50 + Math.cos(angle) * r), y: Math.round(50 + Math.sin(angle) * r * 0.9) };
}

function expand(spec) {
  const slotCounts = { morning: 0, afternoon: 0, evening: 0 };
  const activities = spec.spots.map(([title, desc, tags, slot, cost, duration, image, flags = ''], i) => {
    const time = SLOT_TIME[slot][slotCounts[slot]++ % 4];
    return {
      id: `${spec.id}-${i}`,
      title,
      desc,
      details: `Timings and prices change — confirm locally in ${spec.hub} before you go.`,
      tags,
      slot,
      time,
      duration,
      cost,
      image,
      optional: flags.includes('o'),
      gem: flags.includes('g'),
      indoor: flags.includes('i'),
      ...spread(i, spec.spots.length),
    };
  });
  activities.unshift({
    id: `${spec.id}-arr`, title: `Arrive in ${spec.hub} & check in`, desc: 'Clear arrivals, swap some cash and settle into your stay.',
    details: 'Keep a printed copy of your stay booking and return ticket for immigration.', tags: ['relax'], slot: 'afternoon', time: '13:00',
    duration: '2 hrs', cost: 0, image: 'hotel', arrival: true, x: 14, y: 80,
  });
  activities.push({
    id: `${spec.id}-dep`, title: 'Slow breakfast, souvenirs & departure', desc: 'One last local breakfast and a wander for souvenirs.',
    details: 'Reach the airport at least 3 hours before an international flight.', tags: ['shopping', 'food'], slot: 'morning', time: '09:00',
    duration: '2 hrs', cost: 800, image: 'market', departure: true, x: 86, y: 16,
  });
  const { spots, ...rest } = spec;
  return { ...rest, country: spec.name, categories: [...spec.categories, 'international'], activities };
}

export const COUNTRIES = SPECS.map(expand);
