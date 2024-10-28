import React from 'react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import { FaPlay, FaMobile, FaTablet } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { BsHeadsetVr } from "react-icons/bs";
import { GiConsoleController } from "react-icons/gi";
import { IoTvSharp } from "react-icons/io5";

const deviceData = [
  { icon: <FaMobile />, title: 'smartPhone', descriptionKey: 'descriptionSection3' },
  { icon: <FaTablet />, title: 'Tablet', descriptionKey: 'descriptionSection3' },
  { icon: <MdOutlineLaptopChromebook />, title: 'Laptop', descriptionKey: 'descriptionSection3' },
  { icon: <IoTvSharp />, title: 'SmartTV', descriptionKey: 'descriptionSection3' },
  { icon: <GiConsoleController />, title: 'GamingConsole', descriptionKey: 'descriptionSection3' },
  { icon: <BsHeadsetVr />, title: 'VRHeadsets', descriptionKey: 'descriptionSection3' },
];

const Home = () => {
  const t = useTranslations('HomePage');

  return (
    <section id='Home' className='h-fit overflow-hidden w-full m-auto max-w-8xl'>
      <div className='flex flex-col w-full h-screen'>
        <div className='h-full w-full bg-red-45 -z-10 flex items-center justify-center bg-gradient-to-t from-black-8 via-transparent to-transparent'>
          <div className='h-60 w-60 bg-black-6'></div>
        </div>

        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl md:text-5xl'>{t('h1Section1')}</h1>
          <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 p-4 max-w-4xl text-center'>{t('descriptionSection1')}</p>
          <Button className='bg-red-50 text-white hover:bg-red-50'>
            <FaPlay /> Start Watching Now
          </Button>
        </div>
      </div>

      <div className='flex flex-col mt-20 gap-10'>
        <div className='flex flex-col'>
          <h1 className='text-2xl md:text-4xl'>{t('h1Section2')}</h1>
          <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 max-w-6xl'>{t('descriptionSection2')}</p>
        </div>

        <div className="flex justify-center items-center flex-wrap gap-5 text-white m-auto">
          {deviceData.map((device, index) => (
            <div key={index} className='w-80 p-9 rounded-lg h-50 bg-gradient-to-tr from-red-50 to-white dark:to-black-6 flex flex-col justify-evenly'>
              <div className='flex items-center gap-2'>
                <div className='text-red-45 p-2 bg-gray-900 rounded-lg' style={{ fontSize: '35px' }}>
                  {device.icon}
                </div>
                <h1 className='text-base'>{t(device.title)}</h1>
              </div>
              <p className='text-sm text-white dark:text-gray-65'>{t(device.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;