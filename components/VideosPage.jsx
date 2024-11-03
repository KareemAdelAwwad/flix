import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeDown, FaVolumeUp, FaCog, FaExpand, FaCompress, FaWindowRestore } from 'react-icons/fa';

const VideosPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false); // زر مؤقت في منتصف الفيديو
    const [volume, setVolume] = useState(0.5);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
        setShowPlayPauseOverlay(true);
        setTimeout(() => setShowPlayPauseOverlay(false), 1000); // إخفاء الزر بعد ثانية
    };

    const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
    const toggleVolumeControl = () => setShowVolumeControl(prev => !prev);
    const handleProgress = (state) => setPlayedSeconds(state.playedSeconds);

    const toggleFullscreen = () => {
        if (!isFullScreen && playerContainerRef.current) {
            playerContainerRef.current.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        setIsFullScreen(!isFullScreen);
    };

    const toggleSettings = () => setShowSettings(prev => !prev);

    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        setShowSettings(false);
    };

    const enablePictureInPicture = () => {
        if (playerRef.current && playerRef.current.getInternalPlayer().requestPictureInPicture) {
            playerRef.current.getInternalPlayer().requestPictureInPicture();
        }
    };

    // Format time for display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{ position: 'relative', width: '80%', height: '80vh', margin: 'auto', backgroundColor: '#000' }} ref={playerContainerRef}>
            <ReactPlayer
                ref={playerRef}
                url="/Movies Website Images And Video/play-page/myvideo.mp4"
                playing={isPlaying}
                volume={volume}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                width="100%"
                height="100%"
                controls={false}
            />

            {/* زر التشغيل/الإيقاف المؤقت في المنتصف */}
            {showPlayPauseOverlay && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '50px',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    padding: '20px',
                }}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </div>
            )}

            <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                {/* Volume, Picture-in-Picture, Fullscreen, and Settings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={toggleVolumeControl} style={{ color: volume > 0.5 ? 'white' : 'gray', backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', padding: '8px' }}>
                        {volume === 0 ? <FaVolumeMute /> : volume < 0.5 ? <FaVolumeDown /> : <FaVolumeUp />}
                    </button>
                    {showVolumeControl && (
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            style={{
                                width: '5px',
                                height: '100px',
                                writingMode: 'bt-lr',
                                backgroundColor: volume > 0.5 ? 'white' : 'gray',
                                appearance: 'slider-vertical',
                                position: 'absolute',
                                bottom: '50px'
                            }}
                        />
                    )}

                    <button onClick={enablePictureInPicture} style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', padding: '8px' }}>
                        <FaWindowRestore />
                    </button>
                    
                    <button onClick={toggleFullscreen} style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', padding: '8px' }}>
                        {isFullScreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    <button onClick={toggleSettings} style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', padding: '8px' }}>
                        <FaCog />
                    </button>
                </div>

                {/* Settings for Playback Speed */}
                {showSettings && (
                    <div style={{ position: 'absolute', bottom: '60px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: '5px', padding: '5px' }}>
                        {[0.5, 1, 1.5, 2].map((rate) => (
                            <button key={rate} onClick={() => handlePlaybackRateChange(rate)} style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', border: 'none', padding: '5px 10px', margin: '5px' }}>
                                {rate}x
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Play/Pause and Time Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                    <span>{formatTime(playedSeconds)}</span>
                    <div style={{ width: '300px', height: '5px', backgroundColor: '#444', position: 'relative' }}>
                        <div style={{ height: '100%', backgroundColor: '#ff0000', width: `${(playedSeconds / playerRef.current?.getDuration() || 1) * 100}%` }}></div>
                    </div>
                    <span>{formatTime(playerRef.current?.getDuration() || 0)}</span>
                </div>

                <button onClick={handlePlayPause} style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '50%', padding: '8px' }}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
            </div>
        </div>
    );
};

export default VideosPage;
