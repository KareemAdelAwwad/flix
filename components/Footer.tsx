'use client';
import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes';

// img
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

//translate import
import { useTranslations } from 'next-intl';

const Footer = () => {

  //for translate 
  const t = useTranslations('Footer');

  //for icon theme
  const theme = useTheme().resolvedTheme;

  const socialMediaIcon = 'p-2 rounded-md bg-gray-75 dark:bg-black-10 bg-transparent hover:scale-95 trainsition-all duration-900 border-[1px] dark:border-black-15';
  const themeTriger: any = () => { return theme === "light" ? "text-black-10" : "text-white"; };
  return (
    <footer className='container flex justify-center flex-col items-center mt-14'>
      <div className='flex flex-wrap items-start justify-between w-full gap-8 py-10'>


        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Home')} </h2>
          <Link href='/' className=' text-gray-60  '>{t('Categories')}  </Link>
          <Link href='/' className=' text-gray-60  '> {t('Devices')} </Link>
          <Link href='/' className=' text-gray-60  '> {t('Pricing')} </Link>
          <Link href='/' className=' text-gray-60  '> {t('FAQ')}  </Link>
        </div>

        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'> {t('Movies')} </h2>
          <Link href='/' className=' text-gray-60  '>{t('Trending')}  </Link>
          <Link href='/' className=' text-gray-60  '>{t('NewRelease')}  </Link>
          <Link href='/' className=' text-gray-60  '>{t('Popular')}  </Link>
        </div>



        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'> {t('Shows')} </h2>
          <Link href='/' className=' text-gray-60  '> {t('Trending')} </Link>
          <Link href='/' className=' text-gray-60  '>{t('NewRelease')}   </Link>
          <Link href='/' className=' text-gray-60  '>{t('Popular')}  </Link>
        </div>


        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'> {t('Support')} </h2>
          <Link href='/' className=' text-gray-60  '>{t('ContactUs')}</Link>

        </div>




        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('Subscription')} </h2>
          <Link href='/' className=' text-gray-60  '>  {t('Plans')} </Link>
          <Link href='/' className=' text-gray-60  '> {t('Features')} </Link>
        </div>


        <div className='flex flex-col text-lg'>
          <h2 className='dark:text-white text-black-6'>{t('ContactWithUs')} </h2>
          <div className='flex justify-evenly gap-2'>
            <Link className={socialMediaIcon} href=""> <FaFacebook className={themeTriger} size={22} /> </Link>
            <Link className={socialMediaIcon} href=""> <FaLinkedin className={themeTriger} size={22} /> </Link>
            <Link className={socialMediaIcon} href=""> <FaXTwitter className={themeTriger} size={22} /> </Link>
          </div>
        </div>

      </div>


      {/* the end of Footer */}
      <hr className='w-full border-gray-70' />
      <div className='w-full m-auto flex flex-col justify-between items-center lg:flex-row'>
        <p className='text-gray-65 p-4'> ©2023 StreamVib, All Rights Reserved</p>

        <div className='flex items-center justify-center'>
          <Link className='text-gray-65 p-4' href=''>Terms Of Use</Link>
          <Link className='text-gray-65 p-4' href=''>Privacy Policy</Link>
          <Link className='text-gray-65 p-4' href=''>Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
