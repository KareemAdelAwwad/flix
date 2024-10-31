import { useEffect, useRef, useState } from 'react';
import { SlVolume2, SlVolumeOff  } from 'react-icons/sl';
import { Button } from '@/components/ui/button';
import ReadyTooltip from '@/components/ui/ready-tooltip';

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
      // Set volume to 0.25
      audioRef.current.volume = 0.25;

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

  return (
    <div>
      <audio
        ref={audioRef}
        src={`http://84.235.244.198:6868/convert?name=${encodeURIComponent(songName)}`}
        onEnded={() => setIsPlaying(false)}
      />
      <ReadyTooltip children={
        <Button size='lgIcon' onClick={handlePlayPause}>
          {
            !isPlaying
              ? <SlVolume2 />
              : <SlVolumeOff />
          }
        </Button>
      } title={tooltipTitle} />
    </div>
  );
};

export default AudioPlayer;
