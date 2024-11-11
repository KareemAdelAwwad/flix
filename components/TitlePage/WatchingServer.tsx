import { useState, useEffect, useRef } from 'react';
import ReadyTooltip from '../ui/ready-tooltip';
import { FaServer } from "react-icons/fa6";
import { Button } from '../ui/button';

interface EmbedProps {
  titleID: number | string;
  titleType: 'tv' | 'movie';
  seanonNumber?: number;
  episodeNumber?: number;
  string: string;
  status: boolean;
}

const WatchingServer = ({ string, status, titleType, titleID, seanonNumber, episodeNumber }: EmbedProps) => {
  const [showsEmbed, setShowsEmbed] = useState(status);
  const iframeRef = useRef<HTMLIFrameElement>(null);


  useEffect(() => {
    if (showsEmbed) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'auto';
      if (iframeRef.current) {
        const iframe = iframeRef.current.contentWindow;
        if (iframe) {
          iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      }
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showsEmbed]);

  useEffect(() => {
    setShowsEmbed(status);
  }, [status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowsEmbed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).id === 'Embed-container') {
      setShowsEmbed(false);
    }
  };

  return (
    <>
      <div
        id='Embed-container'
        onClick={handleContainerClick}
        className={`fixed top-0 left-0 right-0 bottom-0 z-[20] bg-black-6 
        bg-opacity-75 backdrop-blur-md justify-center items-center ${showsEmbed ? 'flex' : 'hidden'}`}>
        {titleID ? (
          showsEmbed &&
          <iframe
            ref={iframeRef}
            className='rounded-xl'
            src={titleType === 'tv' ? `https://vidsrc.to/embed/tv/${titleID}`
              : `https://vidsrc.to/embed/movie/${titleID}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            width={800}
            height={450}
            allowFullScreen
          />
        ) : (
          <p className="text-white">No Content available</p>
        )}
      </div>
      <ReadyTooltip children={
        <Button size='lgIcon' onClick={() => (setShowsEmbed(!showsEmbed))}>
          <FaServer />
        </Button>}
        title={string} />
    </>
  );
};

export default WatchingServer;