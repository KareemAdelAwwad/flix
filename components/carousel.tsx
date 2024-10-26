'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import ActorCard from './ActorCard'

const HorizontalCarousel = ({
  data,
}: {
  data: {
    "gender": number,
    "name": string,
    "character": string,
    "profile_path": string,
    "credit_id": string
  }[]
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [imagesPerPage, setImagesPerPage] = useState(8)
  const carouselRef = useRef(null)
  const locale = useLocale()

  // Update images per page based on screen size
  useEffect(() => {
    const updateImagesPerPage = () => {
      const width = window.innerWidth
      if (width < 400) { // xs
        setImagesPerPage(1)
      } else if (width < 520) { // sm
        setImagesPerPage(2)
      } else if (width < 640) { // md
        setImagesPerPage(3)
      } else if (width < 768) { // lg
        setImagesPerPage(4)
      } else if (width < 1024) { // xl
        setImagesPerPage(5)
      } else if (width < 1500) { // xl
        setImagesPerPage(4)
      } else { // 2xl
        setImagesPerPage(8)
      }
    }

    updateImagesPerPage()
    window.addEventListener('resize', updateImagesPerPage)
    return () => window.removeEventListener('resize', updateImagesPerPage)
  }, [])

  const totalPages = Math.ceil(data.length / imagesPerPage)

  return (
    <div className="w-full">
      {/* Carousel container - removed relative */}
      <div className="h-40 overflow-x-hidden">
        {/* Images row container - removed relative */}
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
                    <ActorCard
                      actorName={item.name}
                      credit_id={item.credit_id}
                      profile_path={item.profile_path}
                      character={item.character}
                      key={item.credit_id}
                      gender={item.gender}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons in a separate container */}
      <div className="relative h-0">
      <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`absolute right-20 top-0 -translate-y-[14rem] rounded-full flex justify-center items-center
            border-[1px] border-black-15 bg-black-8 p-3 text-white hover:bg-black-10 ${currentPage === 0 ? 'opacity-50' : 'opacity-100'
            }`}
        >
          <FaArrowLeft className='text-gray-60' />
        </button>

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`absolute right-6 top-0 -translate-y-[14rem] rounded-full flex justify-center items-center
            border-[1px] border-black-15 bg-black-8 p-3 text-white hover:bg-black-10 ${currentPage === totalPages - 1 ? 'opacity-50' : 'opacity-100'
            }`}
        >
          <FaArrowRight className='text-gray-60' />
        </button>
      </div>
    </div>
  )
}

export default HorizontalCarousel
