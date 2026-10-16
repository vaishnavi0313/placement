// Remote photography from Unsplash. Every <SmartImage> falls back to an
// illustrated placeholder if a photo fails to load, so the UI never breaks.
const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const photo = (id, w) => u(id, w);

export const IMAGES = {
  heroMountains: u('photo-1544735716-392fe2489ffa', 2000),
  cta: u('photo-1501785888041-af3ef285b470', 1800),

  // Activity thumbnails, grouped by theme
  tea: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Baskets_of_fresh_tea_leaves_%2828656058492%29.jpg/960px-Baskets_of_fresh_tea_leaves_%2828656058492%29.jpg',
  garden: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Sunken_Garden_Botanical_Garden_Ooty_Aug26_A7CR_12465.jpg/960px-Sunken_Garden_Botanical_Garden_Ooty_Aug26_A7CR_12465.jpg',
  lake: u('photo-1439066615861-d1af74d74000', 600),
  viewpoint: u('photo-1464822759023-fed622ff2c3b', 600),
  food: u('photo-1504674900247-0877df9cc836', 600),
  indianFood: u('photo-1585937421612-70a008356fbe', 600),
  market: u('photo-1533900298318-6b8da08a523e', 600),
  forest: u('photo-1448375240586-882707db888b', 600),
  waterfall: u('photo-1432405972618-c60b0225b8f9', 600),
  beach: u('photo-1507525428034-b723cf961d3e', 600),
  sunset: u('photo-1495616811223-4d98c6e9c869', 600),
  hike: u('photo-1551632811-561732d1e306', 600),
  cafe: u('photo-1495474472287-4d71bcdd2085', 600),
  spa: u('photo-1544161515-4ab6ce6db874', 600),
  temple: u('photo-1537996194471-e657df975ab4', 600),
  fort: u('photo-1599661046289-e31897846e41', 600),
  train: u('photo-1474487548417-781cb71495f3', 600),
  museum: u('photo-1554907984-15263bfd63bd', 600),
  snow: u('photo-1491555103944-7c647fd857e6', 600),
  city: u('photo-1477959858617-67f85cf4f1df', 600),
  rice: u('photo-1555400038-63f5ba517a47', 600),
  hotel: u('photo-1566073771259-6a8506099945', 600),
  desert: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Wahiba_Sands_03.jpg/960px-Wahiba_Sands_03.jpg',
  mosque: u('photo-1512632578888-169bbbc64f33', 600),
  dive: u('photo-1544551763-46a013bb70d5', 600),
};
