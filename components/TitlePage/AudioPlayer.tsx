import { useEffect, useRef, useState } from 'react';
import Lottie from "lottie-react";
import { SlVolume2 } from 'react-icons/sl';
import soundDark from '../../public/images/sound-dark.json';
import soundLight from '../../public/images/sound-light.json';
import { Button } from '@/components/ui/button';
import ReadyTooltip from '@/components/ui/ready-tooltip';
import { useTheme } from 'next-themes';

interface AudioPlayerProps {
  songName: string;
  tooltipTitle: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ songName, tooltipTitle }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedIsPlaying = localStorage.getItem('isPlaying') === 'true';
    setIsPlaying(savedIsPlaying);

    if (audioRef.current) {
      // Set volume to 0.15
      audioRef.current.volume = 0.15;

      // begain from the second 30
      audioRef.current.currentTime = 30;

      // If the song was playing before, start it again
      if (savedIsPlaying) {
        audioRef.current.play().catch((err) => console.error('Error auto-playing:', err));
      }
    }
  }, [songName]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem('isPlaying', 'false');
      } else {
        audioRef.current.play().catch((err) => console.error('Error playing:', err));
        setIsPlaying(true);
        localStorage.setItem('isPlaying', 'true');
      }
    }
  };

  const theme = useTheme().resolvedTheme;


  return (
    <div>
      <audio
        ref={audioRef}
        src={`https://musicapi.kareemadel.com/convert?query=${encodeURIComponent(songName)}`}
        onEnded={() => setIsPlaying(false)}
      />
      <ReadyTooltip title={tooltipTitle}>
        <Button size='lgIcon' onClick={handlePlayPause}>
          {
            !isPlaying
              ? <SlVolume2 />
              : <Lottie animationData={theme === 'light' ? soundDark : soundLight} color='white' loop={true} style={{ width: '24px', height: '24px' }} />
          }
        </Button>
      </ReadyTooltip>
    </div>
  );
};

export default AudioPlayer;
