'use client'
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic'
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
  navStyle?: "style1" | "style2" | "style3";
  placeholderCount?: number;
}

function HorizontalCarousel<T>({
  data,
  ItemComponent,
  settings,
  navStyle = "style2",
  placeholderCount = 8
}: CarouselProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [imagesPerPage, setImagesPerPage] = useState(settings.defaultImagesPerPage || placeholderCount)
  const [isLoading, setIsLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const locale = useLocale()
  const isRTL = locale === "ar"

  // Memoize settings and computed values
  const memoizedBreakpoints = useMemo(() =>
    Object.keys(settings.breakpoints)
      .map(Number)
      .sort((a, b) => a - b),
    [settings.breakpoints]
  )

  // Optimize images per page calculation
  const updateImagesPerPage = useCallback(() => {
    const width = window.innerWidth

    // Find the appropriate breakpoint for current width
    const selectedBreakpoint = memoizedBreakpoints.find(
      breakpoint => width <= breakpoint
    )

    setImagesPerPage(
      selectedBreakpoint
        ? settings.breakpoints[selectedBreakpoint]
        : settings.defaultImagesPerPage || placeholderCount
    )
  }, [memoizedBreakpoints, settings, placeholderCount])

  // Handle loading state and responsive updates
  useEffect(() => {
    updateImagesPerPage()
    window.addEventListener('resize', updateImagesPerPage)

    // Simulate data loading (replace with actual data loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => {
      window.removeEventListener('resize', updateImagesPerPage)
      clearTimeout(timer)
    }
  }, [updateImagesPerPage])

  const totalPages = useMemo(() =>
    Math.ceil((isLoading ? placeholderCount : data.length) / imagesPerPage),
    [data.length, imagesPerPage, isLoading, placeholderCount]
  )

  const buttonClass = `${navStyle === "style3" ? "rounded-lg" : "rounded-full"} flex justify-center items-center group
  border-[1px] border-black-15 bg-black-8 p-3 text-white hover:bg-black-10`

  // Touch event handlers with memoization
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return

    const diffX = touchStartX.current - touchEndX.current
    const threshold = 50 // Minimum swipe distance to trigger page change

    if (Math.abs(diffX) > threshold) {
      if ((isRTL ? diffX < 0 : diffX > 0) && currentPage < totalPages - 1) {
        // Swipe left (next page)
        setCurrentPage(prev => prev + 1)
      } else if ((isRTL ? diffX > 0 : diffX < 0) && currentPage > 0) {
        // Swipe right (previous page)
        setCurrentPage(prev => prev - 1)
      }
    }

    // Reset touch coordinates
    touchStartX.current = null
    touchEndX.current = null
  }

  const renderPageIndicators = useCallback(() => {
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
  }, [totalPages, currentPage])

  const renderCarouselContent = useCallback(() => {
    const itemsToRender = isLoading
      ? new Array(placeholderCount).fill(null)
      : data

    return Array.from({ length: totalPages }).map((_, pageIndex) => (
      <div
        key={pageIndex}
        className="flex h-full w-full shrink-0 gap-2 sm:gap-4"
      >
        {itemsToRender
          .slice(
            pageIndex * imagesPerPage,
            pageIndex * imagesPerPage + imagesPerPage
          )
          .map((item, imageIndex) => (
            <div
              key={pageIndex * imagesPerPage + imageIndex}
              className="h-full z-10 flex-1 flex justify-center items-center"
            >
              <DynamicItemComponent
                item={item}
                isLoading={isLoading}
                ItemComponent={ItemComponent}  // Pass ItemComponent here
              />
            </div>
          ))}
      </div>
    ))
  }, [data, imagesPerPage, totalPages, isLoading, placeholderCount, ItemComponent])

  // Update the dynamic import to handle ItemComponent
  const DynamicItemComponent = dynamic(
    () => Promise.resolve(({
      item,
      isLoading,
      ItemComponent
    }: {
      item?: any,
      isLoading?: boolean,
      ItemComponent: React.ComponentType<{ item: any }>
    }) => (
      <div
        className={`h-full w-full flex items-center justify-center 
          ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}
      >
        {!isLoading && item && <ItemComponent item={item} />}
      </div>
    )),
    { loading: () => <div className="h-full w-full animate-pulse bg-gray-200" /> }
  )

  return (
    <div
      className="w-full relative min-h-[200px]" // Ensure minimum height to prevent CLS
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel container */}
      <div className="h-fit overflow-x-hidden">
        {/* Images row container */}
        <div
          ref={carouselRef}
          style={{
            [isRTL ? 'right' : 'left']: `-${currentPage * 100}%`,
            position: 'relative',
            transition: 'all 1000ms',
          }}
          className="flex h-full w-full"
        >
          {renderCarouselContent()}
        </div>
      </div>

      {/* Navigation buttons and page indicators */}
      <div className={`h-fit flex items-center gap-3 top-0
        ${navStyle === "style1" ? "-translate-y-[13rem]"
          : navStyle === "style3" ? "absolute top-0 -translate-y-[calc(100%+40px)] bg-black-6 border-[1px] border-black-12 p-2 rounded-xl hidden lg:flex"
            : navStyle === "style2" ? "translate-y-6 justify-center hidden lg:flex" : ""}

        ${locale === "ar" ? "flex-row-reverse justify-start left-0" : "flex-row justify-end right-0"}`}>
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`${buttonClass} ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        >
          <FaArrowLeft className='text-gray-60 group-hover:text-white' />
        </button>

        {/* Page Indicators */}
        {navStyle !== "style1" && renderPageIndicators()}

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`${buttonClass} ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        >
          <FaArrowRight className='text-gray-60 group-hover:text-white' />
        </button>
      </div>
    </div>
  )
}

export default HorizontalCarousel