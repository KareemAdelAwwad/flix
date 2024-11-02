'use client';
// data
import links from '@/data/links.json';

import React, { useEffect, useState } from 'react';
// import { useTheme } from 'next-themes';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
//icons
import { RiMenuFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { IoBookmark } from 'react-icons/io5';
import { GoHomeFill } from 'react-icons/go';
import { BiSolidCameraMovie } from 'react-icons/bi';
import { IoTv } from 'react-icons/io5';
import { MdSupportAgent } from 'react-icons/md';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';

// components import
import { ModeToggle } from '@/components/ModeToggle';
import { LangToggle } from '@/components/LangToggle';
import { Button } from './ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

//translate import
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Search from './Search';



const Header = () => {

  //for translate 
  const t = useTranslations('Header');

  // for side bar visible 
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  //for icon theme
  const theme = useTheme().resolvedTheme;
  const locale = useLocale();
  const currentPath = usePathname();
  const themeTriger: any = () => { return theme === "light" ? "text-black-10" : "text-white"; };

  const navItemsClassName = 'p-2 px-4 rounded-3xl hover:bg-neutral-700 hover:text-white text-black-6 dark:text-white bg-transparent transition-all duration-300';

  useEffect(() => {
    setIsSidebarVisible(false);
  }, [currentPath]);
  return (
    <header className='flex items-center justify-between container py-4 text-black' >

      {/* title */}
      <Link className=' cursor-pointer text-3xl font-semibold  ' href='/'>{t('title')}  </Link>


      {/* buttons and section */}
      <div className='z-[100] scale-90  hidden text-white  lg:flex gap-2 items-center p-1 border-2 border-black-20 box-content rounded-full duration-500 '>

        {links.nav.map((link, index) => (
          <Link key={index} href={link.path} className={`${navItemsClassName}
          ${(currentPath == `/${locale}` + (link.path === '/' ? "" : link.path) || currentPath.includes((link.path === '/' ? 'no' : link.path))) && "!bg-red-45 text-white"}`}>{t(link.key)}</Link>
        ))}
        <Search isMobile={false} />
      </div>
      {/* sign in and language side */}
      <div className='hidden lg:flex items-center gap-2'>
        <ModeToggle />
        <LangToggle isMobile={false} />
        <SignedOut>
          <Button className='bg-red-45 text-white rounded-lg hover:bg-red-60'>
            <SignInButton mode='modal'>
              {t('signin')}
            </SignInButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Watchlist"
                labelIcon={<IoBookmark size={18} />}
                href={`${locale}/watchlist`}
              />
              <UserButton.Action label="manageAccount" />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

      </div>

      {/* sidebar button */}
      <RiMenuFill onClick={toggleSidebar} className={` cursor-pointer w-8 h-8 aspect-square ${themeTriger}  lg:absolute duration-500 lg:hidden `} />


      {/* sideBar for mobile and tablet  its disappear at lg*/}
      <div className={`z-[50] py-10 px-5 flex flex-col justify-between fixed top-0  h-full sm:w-96 w-full
        bg-gray-100 dark:bg-black-10 transform 
        ${isSidebarVisible ? 'right-0' : 'right-0 -translate-x-[-100%]'}  ${t('sideBar')} 
        text-xl transition-all duration-300`}>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row w-full items-center justify-between'>
            <h1>{t('title')}</h1>
            <Button onClick={toggleSidebar} className='p-2 aspect-square'>
              <CgClose className={` ${theme === "dark" ? "text-black-10" : "text-white"}`} />
            </Button>
          </div>
          <div className='relative w-full flex flex-row h-fit justify-center items-center'>
            <Search isMobile={true} />
          </div>
        </div>

        {/* setting */}
        <ul className='flex flex-col gap-2'>
          {
            links.nav.map((link, index) => (
              <Link key={index} href={link.path}>
                <li key={index} onClick={toggleSidebar}
                  className={`text-xl p-2 dark:hover:bg-black-30 hover:bg-gray-70 dark:hover:text-white rounded-md cursor-pointer transition-all
                ${(currentPath == `/${locale}` + (link.path === '/' ? "" : link.path) || currentPath.includes((link.path === '/' ? 'no' : link.path))) && "!bg-red-45 text-white"}`}>
                  {t(link.key)}
                </li>
              </Link>
            ))
          }
        </ul>
        <div className='flex w-full justify-between'>
          <LangToggle isMobile />
          <ThemeSwitcher />
        </div>
      </div>

    </header>
  )
}

export default Header
