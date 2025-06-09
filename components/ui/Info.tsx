import React from 'react'
const Info = ({ title, content, icon }: { title: string, content: any, icon: React.ReactNode }) => {
  return (
    <div>
      <div className='flex gap-1 dark:text-gray-60 text-black-30 mb-2'>
        {icon}
        <h6 className='dark:text-gray-60 text-black-30'>{title}</h6>
      </div>
      {content}
    </div>
  )
}

export default Info
