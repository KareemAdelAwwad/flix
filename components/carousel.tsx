'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

type CarouselSettings = {
  breakpoints: {
    [key: number]: number; // width: imagesPerPage
  };
  defaultImagesPerPage?: number;
}

interface CarouselProps<T> {
  data: T[];
  ItemComponent: React.ComponentType<{ item: T }>;
  settings: CarouselSettings;
  navStyle: "style1" | "style2" | "style3";
}

function HorizontalCarousel<T>({
  data,
  ItemComponent,
  settings,
  navStyle
}: CarouselProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [imagesPerPage, setImagesPerPage] = useState(settings.defaultImagesPerPage || 8)
  const carouselRef = useRef(null)
  const locale = useLocale()

  // Update images per page based on screen size
  useEffect(() => {
    const updateImagesPerPage = () => {
      const width = window.innerWidth

      // Get all breakpoints and sort them in descending order
      const breakpoints = Object.keys(settings.breakpoints)
        .map(Number)
        .sort((a, b) => b - a)

      // Find the first breakpoint that matches the current width
      const matchedBreakpoint = breakpoints.find(breakpoint => width < breakpoint)

      if (matchedBreakpoint) {
        setImagesPerPage(settings.breakpoints[matchedBreakpoint])
      } else {
        // If no breakpoint matches, use the default
        setImagesPerPage(settings.defaultImagesPerPage || 8)
      }
    }

    updateImagesPerPage()
    window.addEventListener('resize', updateImagesPerPage)
    return () => window.removeEventListener('resize', updateImagesPerPage)
  }, [settings])

  const totalPages = Math.ceil(data.length / imagesPerPage)
  const buttonClass = `${navStyle === "style3" ? "rounded-lg" : "rounded-full"} flex justify-center items-center group
  border-[1px] border-black-15 bg-black-8 p-3 text-white hover:bg-black-10 ${currentPage === totalPages - 1 ? 'opacity-50' : 'opacity-100'
    }`
  const renderPageIndicators = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-[3px] transition-all duration-300 rounded-full ${index === currentPage
              ? "w-6 bg-red-600"
              : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full relative">
      {/* Carousel container */}
      <div className="h-fit overflow-x-hidden">
        {/* Images row container */}
        <div
          ref={carouselRef}
          style={{
            left: `-${currentPage * 100}%`,
            position: 'relative',
          }}
          className="flex h-full w-full transition-all duration-1000"
        >
          {/* Pages container */}
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="flex justify-center items-center 2xl:justify-normal 2xl:items-start h-full w-full shrink-0 gap-2 sm:gap-4 px-2 sm:px-4"
            >
              {data
                .slice(
                  pageIndex * imagesPerPage,
                  pageIndex * imagesPerPage + imagesPerPage
                )
                .map((item, imageIndex) => (
                  <div
                    key={pageIndex * imagesPerPage + imageIndex}
                    className="h-full z-10"
                  >
                    <ItemComponent item={item} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons and page indicators */}
      <div className={`h-fit flex items-center gap-3 mr-4 top-0
        ${navStyle === "style1" ? "-translate-y-[13rem]"
          : navStyle === "style3" ? "absolute top-0 -translate-y-[calc(100%+40px)] right-0 bg-black-6 border-[1px] border-black-12 p-2 rounded-xl"
            : navStyle === "style2" ? "translate-y-6 justify-center" : ""}

        ${locale === "ar" ? "flex-row-reverse justify-start" : "flex-row justify-end"}`}>
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={buttonClass}
        >
          <FaArrowLeft className='text-gray-60 group-hover:text-white' />
        </button>

        {/* Page Indicators */}
        {navStyle !== "style1" && renderPageIndicators()}

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={buttonClass}
        >
          <FaArrowRight className='text-gray-60 group-hover:text-white' />
        </button>
      </div>
    </div>
  )
}

export default HorizontalCarousel