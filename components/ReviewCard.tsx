import React from 'react'
import Image from 'next/image'
import { AiOutlineLike } from 'react-icons/ai'

interface Review {
  "name": string | "",
  "username": string,
  "avatar_path": string | null,
  "rating": number | null
  "content": string,
  "created_at": string,
  "id": string,
}[]

const ReviewCard = (
  {
    name,
    username,
    avatar_path,
    rating,
    content,
    created_at
  }: Review,
  locale: string
) => {
  return (
    <div className='bg-black-6 p-10 rounded-xl border-[1px] border-black-15'>
      <div className='flex justify-between items-center mb-5'>
        <div className='flex items-center gap-2'>
          <Image src={avatar_path ? `https://image.tmdb.org/t/p/original${avatar_path}` : '/images/robot-image.jpg'}
            alt={name} width={40} height={40} className='rounded-full object-cover' />
          <div>
            <p className='text-white text-xl'>{name || username}</p>
            <p className='text-gray-60 text-lg'>{new Date(created_at).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <AiOutlineLike className='text-white' />
          <p className='text-white'>{rating && Number(rating) * 10 + "%"}</p>
        </div>
      </div>
      <p className='text-gray-60 text-lg'>
        {content.length > 130 ? content.slice(0, 130) + '...' : content}
      </p>
    </div>
  )
}

export default ReviewCard
