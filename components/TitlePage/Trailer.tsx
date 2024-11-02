import { useState, useEffect, useRef } from 'react';
import ReadyTooltip from '../ui/ready-tooltip';
import YoutubeVideo from '@/types/youtube';
import { PiFilmSlateDuotone } from 'react-icons/pi';
import { Button } from '../ui/button';

interface TrailerProps {
  titleName: string;
  string: string;
  status: boolean;
}

const Trailer = ({ titleName, string, status }: TrailerProps) => {
  const [showsTrailer, setShowsTrailer] = useState(status);
  const [trailer, setTrailer] = useState({} as YoutubeVideo);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&type=video&q=${titleName}+trailer`;

  useEffect(() => {
    if (!titleName) {
      console.error('Title name is undefined.');
      return;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('YouTube API response:', data); // Log the API response
        if (data.items && data.items.length > 0) {
          setTrailer(data.items[0]);
        } else {
          console.error('No video found for the given title.');
        }
      })
      .catch(error => console.error('Error fetching YouTube API:', error));
  }, [titleName]);

  useEffect(() => {
    if (showsTrailer) {
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
  }, [showsTrailer]);

  useEffect(() => {
    setShowsTrailer(status);
  }, [status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowsTrailer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).id === 'trailer-container') {
      setShowsTrailer(false);
    }
  };

  return (
    <>
      <div
        id='trailer-container'
        onClick={handleContainerClick}
        className={`fixed top-0 left-0 right-0 bottom-0 z-[20] bg-black-6 
        bg-opacity-75 backdrop-blur-md justify-center items-center ${showsTrailer ? 'flex' : 'hidden'}`}>
        {trailer.id?.videoId ? (
          <iframe
            ref={iframeRef}
            className='rounded-xl'
            src={`https://www.youtube.com/embed/${trailer.id.videoId}?enablejsapi=1`}
            title={titleName + ' trailer'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            width={800}
            height={450}
            allowFullScreen
          />
        ) : (
          <p className="text-white">No trailer available</p>
        )}
      </div>
      <ReadyTooltip children={
        <Button size='lgIcon' onClick={() => (setShowsTrailer(!showsTrailer))}>
          <PiFilmSlateDuotone />
        </Button>}
        title={string} />
    </>
  );
};

export default Trailer;