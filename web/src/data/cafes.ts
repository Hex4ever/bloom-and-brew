export interface Cafe {
  name: string;
  area: string;
  dist: string;
  rating: number;
  tags: string[];
}

export const CAFES: Cafe[] = [
  { name: "Third Wave Coffee",       area: "Indiranagar",  dist: "0.4 km", rating: 4.6, tags: ["V60", "Espresso", "Light Roast"]    },
  { name: "Subko Coffee Roasters",   area: "Koramangala",  dist: "1.2 km", rating: 4.8, tags: ["Single Origin", "Pourover"]         },
  { name: "Blue Tokai",              area: "Indiranagar",  dist: "0.8 km", rating: 4.5, tags: ["Roastery", "Filter"]                },
  { name: "Maverick & Farmer",       area: "Kalyan Nagar", dist: "2.1 km", rating: 4.7, tags: ["Specialty", "Brunch"]              },
  { name: "Dope Coffee",             area: "HSR Layout",   dist: "3.4 km", rating: 4.6, tags: ["Espresso", "Pastries"]             },
  { name: "Araku Coffee",            area: "Lavelle Road", dist: "4.2 km", rating: 4.5, tags: ["Single Estate", "Cold Brew"]       },
];
