import React from 'react'
import { useTranslations } from 'next-intl'
const Info = ({ title, content, icon }: { title: string, content: any, icon: React.ReactNode }) => {
  const t = useTranslations()
  return (
    <div>
      <div className='flex gap-1 dark:text-gray-60 text-black-30 mb-2'>
        {icon}
        <h6 className='dark:text-gray-60 text-black-30'>{t(title)}</h6>
      </div>
      {content}
    </div>
  )
}

export default Info
