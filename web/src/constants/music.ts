const BASE_URL =
  "https://rizncfkqyajsivjsrpoi.supabase.co/storage/v1/object/public/brew-music";

export interface Track {
  id: string;
  title: string;
  artist: string;
  filename: string;
}

export const TRACKS: Track[] = [
  { id: "1", title: "Track 1", artist: "Brew Music", filename: "track1.mp3" },
  { id: "2", title: "Track 2", artist: "Brew Music", filename: "track2.mp3" },
];

export function trackUrl(filename: string): string {
  return `${BASE_URL}/${filename}`;
}
