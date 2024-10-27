import React from 'react'


// import links from '@/data/links.json';
// import { Link } from '@/i18n/routing';
import { Button } from './ui/button';
//translate
import { useTranslations } from 'next-intl';


//react icons
import { FaPlay } from "react-icons/fa";
import { FaMobile } from "react-icons/fa6";
import { FaTablet } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { BsHeadsetVr } from "react-icons/bs";
import { GiConsoleController } from "react-icons/gi";
import { IoTvSharp } from "react-icons/io5";

const Home = () => {

  //for translate
  const t = useTranslations('HomePage');
  
  const sortItemsClassNAme = 'w-40 h-16 text-lg   flex justify-center items-center py-6 px-7  rounded-xl shadow-xl  bg-red-50 transition-all hove:scale-110 duration-300   ';
  return (
    <section id='Home' className='h-fit overflow-hidden w-full m-auto  max-w-8xl  '>
        
        <div className='  flex flex-col w-full h-screen '> 
                  {/* add bg-img  */}
                <div className=' h-full w-full bg-red-45 -z-10 flex items-center justify-center'>
                  {/* add logo  */}
                  <div className='h-60 w-60  bg-black-6'></div>
                </div>


                <div className='flex flex-col items-center justify-center '>
                      <h1 className='text-2xl md:text-5xl'> {t('h1Section1')}</h1>
                      <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 p-4 max-w-4xl text-center' >{t('descriptionSection1')}</p>
                <Button className='bg-red-50 text-white  hover:bg-red-50'><FaPlay/>Start Watching Now</Button>
                </div>
        </div>




<div className='flex flex-col mt-20 gap-10 '>

    <div className='flex flex-col  '>
    <h1 className=' text-2xl md:text-4xl'>{t('h1Section2')}</h1>
<p className='text-sm md:text-base text-gray-500 dark:text-gray-65 max-w-6xl'>{t('descriptionSection2')}</p>
    </div>
      {/* --------------------------------- */}

    <div className="flex  justify-evenly items-center flex-wrap  gap-5 text-white">



   <div className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly '>
         <div className='flex items-center   gap-2'>
            <FaMobile className=' text-red-45 p-2 bg-gray-900 rounded-lg' size={35}/>
            <h1 className='text-base'>smart phone</h1>
         </div>
      <p className='text-sm text-white dark:text-gray-65'> {t('descriptionSection3')}</p>
   </div>
 

   <div className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly '>
         <div className='flex items-center   gap-2'>
            <FaTablet className=' text-red-45 p-2 bg-gray-900 rounded-lg' size={35}/>
            <h1 className='text-base'>{t('Tablet')}</h1>
         </div>
      <p className='text-sm text-white dark:text-gray-65'> {t('descriptionSection3')}</p>
   </div>


   <div className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly '>
         <div className='flex items-center   gap-2'>
            <MdOutlineLaptopChromebook className=' text-red-45 p-2 bg-gray-900 rounded-lg' size={35}/>
            <h1 className='text-base'>{t('Laptop')}</h1>
         </div>
      <p className='text-sm text-white dark:text-gray-65'> {t('descriptionSection3')}</p>
   </div>


   <div className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly '>
         <div className='flex items-center   gap-2'>
            <IoTvSharp className=' text-red-45 p-2 bg-gray-900 rounded-lg' size={35}/>
            <h1 className='text-base'>{t('SmartTV')}</h1>
         </div>
      <p className='text-sm text-white dark:text-gray-65 '>{t('descriptionSection3')} </p>
   </div>


   <div className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly '>
         <div className='flex items-center   gap-2'>
            <GiConsoleController className=' text-red-45 p-2 bg-gray-900 rounded-lg' size={35}/>
            <h1 className='text-base'>{t('GamingConsole')}</h1>
         </div>
      <p className='text-sm text-white dark:text-gray-65'> {t('descriptionSection3')}</p>
   </div>


   <div className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly '>
         <div className='flex items-center   gap-2'>
            <BsHeadsetVr className=' text-red-45 p-2 bg-gray-900 rounded-lg' size={35}/>
            <h1 className='text-base'>{t('VRHeadsets')}</h1>
         </div>
      <p className='text-sm text-white dark:text-gray-65'> {t('descriptionSection3')}</p>
   </div>

    </div>


</div>


{/* <div className='flex   justify-evenly w-full    '>
      {links.HomePage.map((link, index) => (
        <Link key={index} href={link.path} className={sortItemsClassNAme}>{t(link.key)}</Link>
            ))}
</div> */}

    </section>
  )
}

export default Home
