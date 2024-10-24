import React from 'react'
import { useTranslations } from 'next-intl'

const Header = () => {
  const t = useTranslations('Header')
  return (
    <header  >

      {/* logo and web name  */}
      <div className="flex items-center">

        <h1 className="text-3xl font-bold bg-red-50 text-gray-900">{t('title')}</h1>
      </div>
    </header>
  )
}

export default Header