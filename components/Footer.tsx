'use client';
import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes';

// img
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
//translate import
import {useTranslations} from 'next-intl';

const Footer = () => {

    //for translate 
    const t = useTranslations('Footer');

//for icon theme
    const theme = useTheme().resolvedTheme ;


  return (
    <footer className='w-full'>
      <div className='flex flex-wrap items-start justify-evenly w-full'>


        <div className='flex flex-col m-10 text-lg'>
            <h2 className='dark:text-white text-black-6'>{t('Home')} </h2>
             <Link href='/' className=' text-gray-60  '>{t('Categories')}  </Link>
             <Link href='/' className=' text-gray-60  '> {t('Devices')} </Link>
             <Link href='/' className=' text-gray-60  '> {t('Pricing')} </Link>
             <Link href='/' className=' text-gray-60  '> {t('FAQ')}  </Link>
         </div>
        
         <div className='flex flex-col m-10 text-lg'>
            <h2 className='dark:text-white text-black-6'> {t('Movies')} </h2>
              <Link href='/' className=' text-gray-60  '>{t('Trending')}  </Link>
             <Link href='/' className=' text-gray-60  '>{t('NewRelease')}  </Link>
             <Link href='/' className=' text-gray-60  '>{t('Popular')}  </Link>
         </div>



         <div className='flex flex-col m-10 text-lg'>
            <h2 className='dark:text-white text-black-6'> {t('Shows')} </h2>
             <Link href='/' className=' text-gray-60  '> {t('Trending')} </Link>
             <Link href='/' className=' text-gray-60  '>{t('NewRelease')}   </Link>
             <Link href='/' className=' text-gray-60  '>{t('Popular')}  </Link>
         </div>


         <div className='flex flex-col m-10 text-lg'>
            <h2 className='dark:text-white text-black-6'> {t('Support')} </h2>
            <Link href='/' className=' text-gray-60  '>{t('ContactUs')}</Link>
           
         </div>




         <div className='flex flex-col m-10 text-lg'>
            <h2 className='dark:text-white text-black-6'>{t('Subscription')} </h2>
            <Link href='/' className=' text-gray-60  '>  {t('Plans')} </Link>
             <Link href='/' className=' text-gray-60  '> {t('Features')} </Link>
         </div>


         <div className='flex flex-col m-10 text-lg'>
            <h2 className='dark:text-white text-black-6'>{t('ContactWithUs')} </h2>
             <div className='flex justify-evenly  gap-3'>
                <Link className='p-2 rounded-md bg-gray-75 dark:bg-black-10 ' href=""> <FaFacebook className={theme === "dark" ? "text-white" : "text-black-10"} /> </Link>
                <Link className='p-2 rounded-md bg-gray-75 dark:bg-black-10' href=""> <FaLinkedin  className={theme === "dark" ? "text-white" : "text-black-10"} /> </Link>
                <Link className='p-2 rounded-md bg-gray-75 dark:bg-black-10' href=""> <FaWhatsapp  className={theme === "dark" ? "text-white" : "text-black-10"} /> </Link>
             </div>
         </div>

     </div>


{/* the end of Footer */}
<hr  className='w-full border-gray-70'/>
<div className='m-auto flex flex-col justify-center items-center  max-w-7xl  lg:flex-row lg:justify-between'>
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
