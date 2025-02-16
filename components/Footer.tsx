'use client';
import React from 'react'
import links from '@/data/links.json';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/routing';

// img
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

//translate import
import { useTranslations } from 'next-intl';

const Footer = () => {
  const Year = new Date().getFullYear();
  const navItemsClassName = '  text-gray-60';


  //for translate 
  const t = useTranslations('Footer');

  //for icon theme
  const theme = useTheme().resolvedTheme;

  const socialMediaIcon = 'p-2 rounded-md bg-gray-75 dark:bg-black-10 bg-transparent hover:scale-95 trainsition-all duration-900 border-[1px] dark:border-black-15';
  const themeTriger: any = () => { return theme === "light" ? "text-black-10" : "text-white"; };
  return (
    <footer className='container flex justify-center flex-col items-center mt-14'>
      <div className='flex flex-wrap items-start justify-between w-full gap-8 py-10'>



        {/* home  */}
        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Home')} </h2>
          {links.footer.find(section => section.key === "Home")?.links.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className={navItemsClassName}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>




        {/* Movies */}
        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Movies')} </h2>
          {links.footer.find(section => section.key === "Movies")?.links.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className={navItemsClassName}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Shows */}
        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Shows')} </h2>
          {links.footer.find(section => section.key === "Shows")?.links.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className={navItemsClassName}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>






        {/* support */}
        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Support')} </h2>
          {links.footer.find(section => section.key === "Support")?.links.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className={navItemsClassName}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>


        {/* Subscription */}
        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Subscription')} </h2>
          {links.footer.find(section => section.key === "Subscription")?.links.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className={navItemsClassName}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>


        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('ContactWithUs')} </h2>
          <div className='flex justify-evenly gap-2'>
            <Link className={socialMediaIcon} href="#" aria-label={"Facebook"}> <FaFacebook className={themeTriger} size={22} /> </Link>
            <Link className={socialMediaIcon} href="#" aria-label={"LinkedIn"}> <FaLinkedin className={themeTriger} size={22} /> </Link>
            <Link className={socialMediaIcon} href="#" aria-label={"Twitter"}> <FaXTwitter className={themeTriger} size={22} /> </Link>
          </div>
        </div>

      </div>


      {/* the end of Footer */}
      <hr className='w-full border-gray-70' />
      <div className='w-full m-auto flex flex-col justify-between items-center lg:flex-row'>
        <p className='text-gray-65 py-4'> © {t('Rights')} {Year}</p>

        <div className='flex items-center justify-center text-gray-65 gap-8'>
          <Link href=''>{t('Terms')}</Link>
          <Link href=''>{t('Privacy')}</Link>
          <Link href=''>{t('Cookie')}</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
