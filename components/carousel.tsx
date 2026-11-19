'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa6';

export type CarouselSettings = {
  breakpoints: {
    [key: number]: number;
  };
  defaultImagesPerPage?: number;
};

interface CarouselProps<T> {
  data: T[];
  ItemComponent: React.ComponentType<{ item: T }>;
  settings: CarouselSettings;
  navStyle?: 'style1' | 'style2' | 'style3';
  placeholderCount?: number;
}

function HorizontalCarousel<T>({
  data,
  ItemComponent,
  settings,
  navStyle = 'style2',
  placeholderCount = 8,
}: CarouselProps<T>) {
  const defaultPerPage = settings.defaultImagesPerPage || placeholderCount;
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(defaultPerPage);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const sortedBreakpoints = useMemo(
    () =>
      Object.keys(settings.breakpoints)
        .map(Number)
        .sort((a, b) => a - b),
    [settings.breakpoints]
  );

  const updateImagesPerPage = useCallback(() => {
    const width = window.innerWidth;
    const selectedBreakpoint = sortedBreakpoints.find((bp) => width <= bp);
    setImagesPerPage(
      selectedBreakpoint ? settings.breakpoints[selectedBreakpoint] : defaultPerPage
    );
  }, [sortedBreakpoints, settings.breakpoints, defaultPerPage]);

  useEffect(() => {
    updateImagesPerPage();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(updateImagesPerPage, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timer) clearTimeout(timer);
    };
  }, [updateImagesPerPage]);

  const totalPages = Math.max(1, Math.ceil(data.length / imagesPerPage));

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

  const buttonClass = `${
    navStyle === 'style3' ? 'rounded-lg' : 'rounded-full'
  } flex justify-center items-center group borders dark:bg-black-8 bg-white p-3 dark:hover:bg-black-10`;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if ((isRTL ? diffX < 0 : diffX > 0) && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if ((isRTL ? diffX > 0 : diffX < 0) && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [isRTL, currentPage, totalPages]);

  const pages = useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < data.length; i += imagesPerPage) {
      result.push(data.slice(i, i + imagesPerPage));
    }
    return result;
  }, [data, imagesPerPage]);

  const translateXPercent = (isRTL ? 1 : -1) * currentPage * 100;

  return (
    <div
      className="w-full relative min-h-[200px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-fit overflow-x-hidden">
        <div
          style={{
            transform: `translate3d(${translateXPercent}%, 0, 0)`,
          }}
          className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
        >
          {pages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className="flex h-full w-full shrink-0 gap-2 sm:gap-4">
              {pageItems.map((item, imageIndex) => (
                <div
                  key={pageIndex * imagesPerPage + imageIndex}
                  className="h-full z-10 flex-1 flex justify-center items-center"
                >
                  <ItemComponent item={item} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div
          className={`h-fit flex items-center gap-3 top-0 ${
            navStyle === 'style1'
              ? '-translate-y-[13rem]'
              : navStyle === 'style3'
                ? 'absolute top-0 -translate-y-[calc(100%+40px)] dark:bg-black-6 bg-gray-95 borders p-2 rounded-xl hidden lg:flex'
                : navStyle === 'style2'
                  ? 'translate-y-6 justify-center hidden lg:flex'
                  : ''
          } ${locale === 'ar' ? 'flex-row-reverse justify-start left-0' : 'flex-row justify-end right-0'}`}
        >
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            className={`${buttonClass} ${
              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Previous"
          >
            <FaArrowLeft className="dark:text-gray-60 text-black-25 dark:group-hover:text-white group-hover:text-black-6" />
          </button>

          {navStyle !== 'style1' && (
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-[3px] transition-all duration-300 rounded-full ${
                    index === currentPage ? 'w-6 bg-red-600' : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            className={`${buttonClass} ${
              currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Next"
          >
            <FaArrowRight className="dark:text-gray-60 text-black-25 dark:group-hover:text-white group-hover:text-black-6" />
          </button>
        </div>
      )}
    </div>
  );
}

export default HorizontalCarousel;