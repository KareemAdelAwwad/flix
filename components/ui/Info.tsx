import React from 'react'
import { useTranslations } from 'next-intl'
const Info = ({ title, content, icon }: { title: string, content: any, icon: React.ReactNode }) => {
  const t = useTranslations()
  return (
    <div>
      <div className='flex gap-1 text-gray-60 mb-2'>
        {icon}
        <p>{t(title)}</p>
      </div>
      {content}
    </div>
  )
}

export default Info
