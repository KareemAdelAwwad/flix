"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';

//img src
import { RiMenuFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { CgClose } from "react-icons/cg";

// components import
import { ModeToggle } from '@/components/ModeToggle';
import { LangToggle } from '@/components/LangToggle';
import { Button } from './ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
 
 

//translate import
import {useTranslations} from 'next-intl';
import  Link  from 'next/link';

 

const Header = () => {

  //for translate 
  const t = useTranslations('Header');


      // for side bar visible 
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };  
  
  //for icon theme
    const theme = useTheme().resolvedTheme ;

 
  return (
    <header className=' overflow-hidden relative   flex  items-center justify-between w-full max-w-screen-xl m-auto p-5 text-black dark:text-white '>
      
         {/* title */}
          <Link className=' cursor-pointer  text-3xl font-semibold  ' href='/'>{t('title')}  </Link>
        
  
         {/* buttons and section */}
        <div  className=' scale-90  hidden text-black-6  dark:text-white  lg:flex  gap-2 items-center p-1 bg-white dark:bg-black-6 border-2 border-neutral-500 box-content rounded-3xl  hover:scale-100  duration-500 '>

          <Link href="" className='  p-2 rounded-3xl hover:bg-neutral-700 hover:text-white hover:mx-3 text-black-6  dark:text-white bg-transparent    transition-all duration-300  ' >{t('homeBTN')}</Link>
          <Link href="" className='  p-2 rounded-3xl hover:bg-neutral-700 hover:text-white hover:mx-3 text-black-6  dark:text-white bg-transparent    transition-all duration-300  ' >{t('Movies&ShowsBTN')} </Link>
          <Link href="" className='  p-2 rounded-3xl hover:bg-neutral-700 hover:text-white hover:mx-3 text-black-6  dark:text-white bg-transparent    transition-all duration-300  ' >{t('SupportBTN')} </Link>
          <Link href="" className='  p-2 rounded-3xl hover:bg-neutral-700 hover:text-white hover:mx-3 text-black-6  dark:text-white bg-transparent    transition-all duration-300  ' >{t('SubscriptionsBTN')} </Link>
          <Link href="" className='  p-3  rounded-full bg-neutral-700   hover:bg-neutral-700       transition-all duration-300  ' > <CiSearch className={` h-15 w-15  text-white `}/>  </Link>
        </div>
          
        

             
 

         {/* sign in and language side */}

         <div className='hidden  lg:flex items-center gap-2  '  >
              <ModeToggle/>
              <LangToggle/>
             
         <Button className='bg-red-45 px-4 py-3 font-medium text-white rounded-lg hover:bg-red-60'> Sign in</Button>
        
          </div>

 

            {/* sidebar button */}
                <RiMenuFill onClick={toggleSidebar}   className={` cursor-pointer w-10 h-10 ${theme === "dark" ? "text-white" : "text-black-10"}  lg:absolute lg:-left-96 duration-500`} /> 


      {/* sideBar for mobile and tablet  its disappear at lg*/}
      <div className={` pt-10 flex flex-col   fixed top-0  h-full w-72   bg-gray-100 dark:bg-black-12 transform ${isSidebarVisible ? 'right-0' : '-right-72'}  ${t('sideBar')}    text-xl transition-all duration-300`}>
        <Button onClick={toggleSidebar}  className='p-2 absolute left-0 top-0'> <CgClose className={` ${ theme === "dark" ? "text-black-10" :"text-white " }`}/> </Button>
          <ul>
                 <li onClick={toggleSidebar} className=" text-xl p-2 hover:bg-gray-500 hover:text-white cursor-pointer">{t('homeBTN')} </li>
                 <li onClick={toggleSidebar} className=" text-xl p-2 hover:bg-gray-500 hover:text-white cursor-pointer">{t('Movies&ShowsBTN')} </li>
                 <li onClick={toggleSidebar} className=" text-xl p-2 hover:bg-gray-500 hover:text-white cursor-pointer"> {t('SupportBTN')}</li>
                 <li onClick={toggleSidebar} className=" text-xl p-2 hover:bg-gray-500 hover:text-white cursor-pointer">{t('SubscriptionsBTN')} </li>
                   {/* button setting */}
                 
              <LangToggle/>
            
              <ThemeSwitcher/>
             

                          
            </ul>
     </div>

    </header>
  )
}

export default Header
