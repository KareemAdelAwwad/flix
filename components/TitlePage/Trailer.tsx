'use client';

import { useState, useEffect } from 'react';
import ReadyTooltip from '../ui/ready-tooltip';
import { PiFilmSlateDuotone } from 'react-icons/pi';
import { Button } from '../ui/button';

interface TrailerProps {
  titleName: string;
  trailerKey: string | null;
  string: string;
  status: boolean;
}

const Trailer = ({ titleName, trailerKey, string, status }: TrailerProps) => {
  const [showsTrailer, setShowsTrailer] = useState(status);

  useEffect(() => {
    setShowsTrailer(status);
  }, [status]);

  useEffect(() => {
    if (showsTrailer) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showsTrailer]);

  useEffect(() => {
    if (!showsTrailer) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowsTrailer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showsTrailer]);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).id === 'trailer-container') {
      setShowsTrailer(false);
    }
  };

  return (
    <>
      {showsTrailer && (
        <div
          id="trailer-container"
          onClick={handleContainerClick}
          className="fixed inset-0 z-[20] bg-black-6 bg-opacity-75 backdrop-blur-md flex justify-center items-center"
        >
          {trailerKey ? (
            <iframe
              className="rounded-xl max-w-[92vw]"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&enablejsapi=1`}
              title={`${titleName} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              width={800}
              height={450}
              allowFullScreen
            />
          ) : (
            <p className="text-white">No trailer available</p>
          )}
        </div>
      )}
      <ReadyTooltip title={string}>
        <Button size="lgIcon" onClick={() => setShowsTrailer((prev) => !prev)} aria-label={string}>
          <PiFilmSlateDuotone />
        </Button>
      </ReadyTooltip>
    </>
  );
};

export default Trailer;