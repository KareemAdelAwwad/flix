'use client';
// data
import links from '@/data/links.json';

import React, { useState } from 'react';
// import { useTheme } from 'next-themes';
import { Link } from '@/i18n/routing';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
//img src
import { RiMenuFill } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

// components import
import { ModeToggle } from '@/components/ModeToggle';
import { LangToggle } from '@/components/LangToggle';
import { Button } from './ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';



//translate import
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

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
  const themeTriger: any = () => { return theme === "light" ? "text-black-10" : "text-white"; };

  const navItemsClassName = 'p-2 px-4 rounded-3xl hover:bg-neutral-700 hover:text-white text-black-6 dark:text-white bg-transparent transition-all duration-300';
  return (
    <header className='relative flex items-center justify-between container py-4 text-black dark:text-white' >

      {/* title */}
      <Link className=' cursor-pointer text-3xl font-semibold  ' href='/'>{t('title')}  </Link>


      {/* buttons and section */}
      <div className=' scale-90  hidden text-black-6  dark:text-white  lg:flex gap-2 items-center p-1 border-2 border-black-20 box-content rounded-full duration-500 '>


        {links.nav.map((link, index) => (
          <Link key={index} href={link.path} className={navItemsClassName}>{t(link.key)}</Link>
        ))}
        <Link href="" className='p-3 rounded-full bg-black-20 hover:hover:bg-black-30 transition-all duration-300' >
          <BsSearch className={`text-white`} size={16} />
        </Link>
      </div>
      {/* sign in and language side */}
      <div className='hidden lg:flex items-center gap-2'>
        <ModeToggle />
        <LangToggle />
        <SignedOut>
          <Button className='bg-red-45 px-3 py-2 font-medium text-white rounded-lg hover:bg-red-60'>
            <SignInButton>
              {t('signin')}
            </SignInButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

      </div>

      {/* sidebar button */}
      <RiMenuFill onClick={toggleSidebar} className={` cursor-pointer w-10 h-10 aspect-square ${themeTriger}  lg:absolute duration-500 lg:hidden `} />


      {/* sideBar for mobile and tablet  its disappear at lg*/}
      <div className={`z-20 pt-10 flex flex-col fixed top-0 h-full w-72 bg-gray-100 dark:bg-black-12 transform ${isSidebarVisible ? 'right-0' : '-right-72'} text-xl transition-all duration-300`}>
        <Button onClick={toggleSidebar} className='p-2 absolute left-0 top-0 w-10 h-10 aspect-square'> <CgClose className={themeTriger} /> </Button>
        <ul>
          {
            links.nav.map((link, index) => (
              <Link key={index} href={link.path}>
                <li key={index} onClick={toggleSidebar} className="text-xl p-2 hover:bg-gray-500 hover:text-white cursor-pointer">
                  {t(link.key)}
                </li>
              </Link>
            ))
          }
          <LangToggle />
          <ThemeSwitcher />
        </ul>
      </div>

    </header>
  )
}

export default Header
