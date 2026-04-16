export interface CommunityPost {
  id: string;
  user: string;
  time: string;
  caption: string;
  likes: number;
  comments: number;
  hue: number;
}

export const FEED: CommunityPost[] = [
  { id: "1", user: "kenji.brews",   time: "2h", caption: "Sunday V60 with Ethiopian Yirgacheffe — bright and floral.", likes: 142, comments: 18, hue: 30 },
  { id: "2", user: "morning_pour",  time: "5h", caption: "First pull on the new Cafelat. Worth the wait.",            likes: 89,  comments: 7,  hue: 18 },
  { id: "3", user: "slow_drip_co",  time: "1d", caption: "Aeropress + Geisha = afternoon reset.",                     likes: 234, comments: 31, hue: 42 },
];
