import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Play, Pause, Settings,
  VolumeX, Volume1, Volume2,
  Maximize, Minimize, PictureInPicture2
} from 'lucide-react';

interface VideoPlayerProps {
  url?: string;
  onProgress?: (state: { playedSeconds: number }) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url = 'https://a.top4top.io/m_3236a7i5b1.mp4', onProgress }) => {
  // Shorekeaper url : 'https://b.top4top.io/m_3235cyxtw1.mp4'
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastVolume, setLastVolume] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        // Lock to landscape when entering fullscreen
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch((err: any) => {
            console.warn('Orientation lock failed:', err);
          });
        }
      } else {
        // Unlock when exiting fullscreen
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          handlePlayPause();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullScreen) toggleFullscreen();
          break;
        case 'ArrowUp':
          setVolume(v => Math.min(v + 0.1, 1));
          break;
        case 'ArrowDown':
          setVolume(v => Math.max(v - 0.1, 0));
          break;
        case 'ArrowLeft':
          handleSeek(Math.max(playedSeconds - 5, 0));
          break;
        case 'ArrowRight':
          handleSeek(Math.min(playedSeconds + 5, duration));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isFullScreen, playedSeconds, duration]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSpeedMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (isFullScreen) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullScreen]);

  const handlePlayPause = () => {
    setIsPlaying(() => (!isPlaying));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleVolumeControl = () => {
    setShowVolumeControl(() => (!showVolumeControl));
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
    onProgress?.(state);
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullScreen && playerContainerRef.current) {
        await playerContainerRef.current.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const toggleSettings = () => {
    setShowSettings(() => (!showSettings));
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const togglePictureInPicture = async () => {
    try {
      const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
      if (!videoElement) return;

      if (!document.pictureInPictureEnabled) {
        throw new Error('Picture in Picture is not supported');
      }

      if (!isPictureInPicture) {
        await videoElement.requestPictureInPicture();
        setIsPictureInPicture(true);
      } else {
        await document.exitPictureInPicture();
        setIsPictureInPicture(false);
      }
    } catch (error) {
      console.error('Picture in Picture error:', error);
    }
  };

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    handleSeek(parseFloat((e.target as HTMLInputElement).value));
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (!seeking) {
      handleSeek(value);
    }
  };

  const handleVolumeClick = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 0.1);
    }
  };

  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  const handleVideoClick = () => {
    isPlaying ? setIsPlaying(false) : setIsPlaying(true);
  };

  return (
    <div ref={playerContainerRef} className={`mx-7 rounded-lg overflow-hidden relative ${isFullScreen ? 'fullscreen' : ''} ${showControls ? '' : 'hide-cursor'}`} onDoubleClick={handleDoubleClick}>
      <div onClick={handleVideoClick}>
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={isPlaying}
          volume={volume}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={handleDuration}
          width="100%"
          height="100%"
          style={{ backgroundColor: '#000' }}
        />
      </div>

      {showControls && (
        <div className="z-10 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2">
          {/* Controls row */}
          <div className="flex flex-col items-center justify-between mb-2
          sm:py-1 pt-4 px-4 rounded-lg bg-black-30 bg-opacity-50 backdrop-blur-md">
            {/* Timeline scrubber for large devices */}
            <div className="relative group w-full mx-4 block sm:hidden">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={seeking ? progress : playedSeconds}
                step="any"
                className="absolute w-full h-1 bg-gray-600 rounded-full cursor-pointer
                        group-hover:h-1.5 transition-all duration-150 accent-red-45"
                onChange={handleTimelineChange}
                onMouseDown={handleSeekMouseDown}
                onMouseUp={handleSeekMouseUp}
              />
              <div
                className="absolute h-1 group-hover:h-1.5 transition-all duration-75 bg-red-45 pointer-events-none
              rounded-full"
                style={{
                  width: `${(playedSeconds / duration) * 100}%`,
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
            <div className='flex items-center justify-between w-full sm:mt-auto mt-2'>
              <div className="flex items-center md:space-x-4 space-x-1">
                {/* Play/Pause */}
                <button onClick={handlePlayPause} className='p-2 hover:bg-white/10 rounded text-white'>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Volume */}
                <div className="relative group flex">
                  <button
                    onClick={handleVolumeClick}
                    className="p-2 hover:bg-white/10 rounded text-white"
                  >
                    {getVolumeIcon()}
                  </button>
                  <div className="absolute -translate-y-4 -rotate-90 items-center justify-center
                translate-x-[-50%] left-[50%] bottom-full hidden hover:flex group-hover:flex">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      className="h-24 w-fit bg-gray-600 rounded-full cursor-pointer accent-red-45"
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>

                {/* Time */}
                <span className="text-sm text-white">
                  {formatTime(playedSeconds)}
                </span>
              </div>


              {/* Timeline scrubber for large devices */}
              <div className="relative group w-full mx-4 hidden sm:block">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={seeking ? progress : playedSeconds}
                  step="any"
                  className="absolute w-full h-1 bg-gray-600 rounded-full cursor-pointer
                        group-hover:h-1.5 transition-all duration-150 accent-red-45"
                  onChange={handleTimelineChange}
                  onMouseDown={handleSeekMouseDown}
                  onMouseUp={handleSeekMouseUp}
                />
                <div
                  className="absolute h-1 group-hover:h-1.5 transition-all duration-75 bg-red-45 pointer-events-none
              rounded-full"
                  style={{
                    width: `${(playedSeconds / duration) * 100}%`,
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>


              <div className="flex items-center md:space-x-4 space-x-1">
                {/* Duration Time */}
                <span className="text-sm text-white">
                  {formatTime(duration)}
                </span>

                {/* Settings */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="group p-2 hover:bg-white/10 rounded text-white transform transition-transform duration-200"
                  >
                    <Settings size={20}
                      className='group-hover:rotate-90 transform transition-transform duration-200'
                    />
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg
                    p-2 min-w-[120px] bg-black-30 bg-opacity-50 backdrop-blur-md">
                      {playbackSpeeds.map(speed => (
                        <button
                          key={speed}
                          className={`block w-full text-left px-3 py-1 hover:bg-white/10 rounded
                                  ${playbackRate === speed ? 'text-red-500' : 'text-white'}`}
                          onClick={() => {
                            setPlaybackRate(speed);
                            setShowSpeedMenu(false);
                          }}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PiP button */}
                <button
                  onClick={togglePictureInPicture}
                  className="p-2 hover:bg-white/10 rounded text-white sm:block hidden"
                >
                  <PictureInPicture2 size={20} />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded text-white"
                >
                  {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const pad = (num: number) => String(num).padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
};

export default VideoPlayer;

<style jsx>{`
  input[type='range'] {
    -webkit-appearance: none;
    background: transparent;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #ff0000;
    cursor: pointer;
    margin-top: -5px;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    background: rgba(255,255,255,0.3);
    border-radius: 999px;
  }
`}</style>