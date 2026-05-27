export interface DateCategory {
  id: string;
  label: string;
  emoji: string;
  subcategories: string[];
}

export const DATE_CATEGORIES: DateCategory[] = [
  {
    id: "food",
    label: "Food Date",
    emoji: "🍔",
    subcategories: [
      "Samgyupsal",
      "Sushi",
      "Ramen",
      "Steak",
      "Fast Food",
      "Café Desserts",
      "Seafood",
      "Unlimited Wings",
    ],
  },
  {
    id: "movie",
    label: "Movie Date",
    emoji: "🎬",
    subcategories: [
      "Horror",
      "Romance",
      "Anime",
      "Marvel",
      "Comedy",
      "K-Drama Marathon",
    ],
  },
  {
    id: "gaming",
    label: "Gaming Date",
    emoji: "🎮",
    subcategories: [
      "Valorant",
      "Minecraft",
      "Mobile Legends",
      "Roblox",
      "It Takes Two",
      "Co-op Party Games",
    ],
  },
  {
    id: "cafe",
    label: "Café Date",
    emoji: "☕",
    subcategories: [
      "Matcha Latte Run",
      "Pastry Tasting",
      "Book Café",
      "Open Mic Night",
      "Bubble Tea Hop",
      "Sunset Rooftop Café",
    ],
  },
  {
    id: "beach",
    label: "Beach Date",
    emoji: "🌊",
    subcategories: [
      "Sunset Walk",
      "Picnic by the Shore",
      "Swimming",
      "Beach Volleyball",
      "Sandcastle Building",
      "Stargazing",
    ],
  },
  {
    id: "adventure",
    label: "Adventure Date",
    emoji: "🎡",
    subcategories: [
      "Amusement Park",
      "Hiking Trail",
      "Zip Line",
      "Escape Room",
      "Go-Kart Racing",
      "Mini Golf",
    ],
  },
  {
    id: "art",
    label: "Art/Museum Date",
    emoji: "🎨",
    subcategories: [
      "Modern Art Gallery",
      "History Museum",
      "Pottery Class",
      "Street Art Tour",
      "Photography Walk",
      "Live Painting Session",
    ],
  },
  {
    id: "mall",
    label: "Mall Date",
    emoji: "🛍️",
    subcategories: [
      "Window Shopping",
      "Arcade Zone",
      "Food Court Tour",
      "Photo Booth Fun",
      "Catch a Mall Movie",
      "Gift Hunting",
    ],
  },
  {
    id: "home",
    label: "Stay-at-home Date",
    emoji: "🏡",
    subcategories: [
      "Movie Marathon",
      "Cook Together",
      "Board Games",
      "Spa Night",
      "Stargazing from Balcony",
      "Build a Blanket Fort",
    ],
  },
  {
    id: "karaoke",
    label: "Karaoke Date",
    emoji: "🎤",
    subcategories: [
      "Love Songs Only",
      "Duets Night",
      "90s Throwbacks",
      "K-Pop Hits",
      "Disney Medley",
      "Power Ballads",
    ],
  },
  {
    id: "travel",
    label: "Travel Date",
    emoji: "✈️",
    subcategories: [
      "Day Trip Nearby",
      "Road Trip",
      "Weekend Getaway",
      "City Exploration",
      "Nature Retreat",
      "Hidden Gem Hunt",
    ],
  },
];

export function getCategoryById(id: string): DateCategory | undefined {
  return DATE_CATEGORIES.find((c) => c.id === id);
}
