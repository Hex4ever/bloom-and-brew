import { useEffect, useRef } from "react";
import { useAppContext } from "../AppContext";
import { TRACKS, trackUrl } from "../constants/music";
import type { Track } from "../constants/music";

export function MusicPlayer() {
  const { musicPlaying, musicMuted, currentTrack, setCurrentTrack } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shuffledRef = useRef<Track[]>([]);
  const indexRef = useRef(0);

  // Build shuffled playlist once on mount
  useEffect(() => {
    shuffledRef.current = [...TRACKS].sort(() => Math.random() - 0.5);
  }, []);

  // When playback starts with no track, pick the first shuffled track
  useEffect(() => {
    if (musicPlaying && !currentTrack && shuffledRef.current.length > 0) {
      setCurrentTrack(shuffledRef.current[0]);
      indexRef.current = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPlaying]);

  // Load new src and play whenever the track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = trackUrl(currentTrack.filename);
    audio.volume = musicMuted ? 0 : 1;
    if (musicPlaying) {
      void audio.play().catch(() => { /* browser blocked autoplay before user gesture */ });
    }
  // Only re-run when the track id changes — musicPlaying/musicMuted handled by their own effects
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Play / pause without changing the track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying && audio.src) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [musicPlaying]);

  // Mute / unmute — volume only, track position preserved
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = musicMuted ? 0 : 1;
  }, [musicMuted]);

  const handleEnded = () => {
    indexRef.current = (indexRef.current + 1) % shuffledRef.current.length;
    setCurrentTrack(shuffledRef.current[indexRef.current]);
  };

  return <audio ref={audioRef} onEnded={handleEnded} />;
}
