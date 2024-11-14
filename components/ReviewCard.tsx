import React from 'react'
import Image from 'next/image'
import RatingStars from './ui/RatingStars'

interface ReviewProps {
  name: string | "";
  username: string;
  avatar_path: string | null;
  rating: number | null;
  content: string;
  created_at: string;
  id: string;
  locale: string;
}

interface ReviewState {
  expanded: boolean;
}

class ReviewCard extends React.Component<ReviewProps, ReviewState> {
  constructor(props: ReviewProps) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleExpanded = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  }

  render() {
    const {
      name,
      username,
      avatar_path,
      rating,
      content,
      created_at,
      locale
    } = this.props;

    const { expanded } = this.state;

    return (
      <div className='dark:bg-black-6 bg-white p-4 sm:p-6 md:p-10 rounded-xl borders w-full'>
        <div className='flex justify-between items-center mb-5 w-full'>
          <div className='flex items-center gap-2'>
            <Image
              src={avatar_path ? `https://image.tmdb.org/t/p/original${avatar_path}` : '/images/robot-image.jpg'}
              alt={name}
              width={40}
              height={40}
              className='rounded-full object-cover'
            />
            <div>
              <p className='dark:text-white text-black-6 text-xl'>{name || username}</p>
              <p className='dark:text-gray-60 text-black-30 text-lg'>
                {new Date(created_at).toLocaleDateString(locale, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {rating && <RatingStars rating={rating / 2} /> || null}
          </div>
        </div>
        <p className='dark:text-gray-60 text-black-30 text-lg'>
          {content.length > 160 ? (
            <>
              {expanded ? content : content.slice(0, 160).split(' ').slice(0, -1).join(' ') + '...'}
              <button onClick={this.toggleExpanded} className='text-red-60 ml-2'>
                {expanded ? 'Show less' : 'Show more'}
              </button>
            </>
          ) : (
            content
          )}
        </p>
      </div>
    );
  }
}

export default ReviewCard