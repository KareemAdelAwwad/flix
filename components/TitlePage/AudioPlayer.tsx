'use client';

import { useEffect, useRef, useState } from 'react';
import { SlVolume2 } from 'react-icons/sl';
import { Button } from '@/components/ui/button';
import ReadyTooltip from '@/components/ui/ready-tooltip';

interface AudioPlayerProps {
  songName: string;
  tooltipTitle: string;
}

const EqualizerIcon = () => (
  <span className="flex items-end justify-center gap-[3px] w-6 h-5" aria-hidden="true">
    <span className="w-[3px] h-full bg-current rounded-full origin-bottom animate-equalizer-bar" />
    <span
      className="w-[3px] h-full bg-current rounded-full origin-bottom animate-equalizer-bar"
      style={{ animationDelay: '0.2s' }}
    />
    <span
      className="w-[3px] h-full bg-current rounded-full origin-bottom animate-equalizer-bar"
      style={{ animationDelay: '0.4s' }}
    />
  </span>
);

const AudioPlayer: React.FC<AudioPlayerProps> = ({ songName, tooltipTitle }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRequestedAudio, setHasRequestedAudio] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setHasRequestedAudio(false);
  }, [songName]);

  useEffect(() => {
    if (!hasRequestedAudio || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = 0.15;
    audio.play().catch((err) => {
      console.error('Error playing theme audio:', err);
      setIsPlaying(false);
    });
  }, [hasRequestedAudio]);

  const handlePlayPause = () => {
    if (!hasRequestedAudio) {
      setHasRequestedAudio(true);
      setIsPlaying(true);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => {
        console.error('Error playing theme audio:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const audioSrc = hasRequestedAudio
    ? `https://musicapi.kareemadel.com/convert?query=${encodeURIComponent(songName)}`
    : undefined;

  return (
    <div>
      {hasRequestedAudio && (
        <audio
          ref={audioRef}
          preload="none"
          src={audioSrc}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <ReadyTooltip title={tooltipTitle}>
        <Button size="lgIcon" onClick={handlePlayPause} aria-label={tooltipTitle}>
          {!isPlaying ? <SlVolume2 /> : <EqualizerIcon />}
        </Button>
      </ReadyTooltip>
    </div>
  );
};

export default AudioPlayer;
