"use client";
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import { FaPlay, FaMobile, FaTablet } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { BsHeadsetVr } from "react-icons/bs";
import { GiConsoleController } from "react-icons/gi";
import { IoTvSharp } from "react-icons/io5";
// import { Dice1 } from 'lucide-react';
import PMSECTION from "@/components/PopularMoviesSection"
import BgHome from "@/components/BgHome"




interface PlanCardProps {
  style: string;
  name: string;
  price: number;
  resolution: string;
  devices: number;
  downloads: number;
  spatialAudio?: boolean;
}

function PlanCard({ style, name, price, resolution, devices, downloads, spatialAudio }: PlanCardProps) {
  const t = useTranslations('HomePage');
  return (
    <div className="bg-transparent border-black-6   border  dark:bg-black-10 rounded-lg   shadow-md  ">

      <div className={` ${style} bg-red-50 rounded-lg p-3 `}> <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
        <span className="text-white text-xl  ">{t("resolution")}</span> <span className='text-white'>{resolution}</span>
      </div>

      <ul className="list-none flex flex-col justify-evenly px-2  ">
        <li className=" py-5 mb-2">
          <h1 className='text-lg text-black-20 dark:text-gray-70'>{t("monthly_price")}</h1>
          <p className="text-xl  mb-4 text-black-10 dark:text-white">EGP {price}</p>
        </li>

        <li className=" py-5 mb-2 border-t border-black-6 dark:border-white">
          <div className="text-lg text-black-20 dark:text-gray-70 ">{t("video_sound_quality")} </div>{' '}
          <span className='text-xl text-black-10 dark:text-white'>{name === 'Premium' ? 'Best' : name === 'Standard' ? 'Great' : 'Good'}</span>
        </li>

        <li className=" py-5 mb-2 border-t border-black-6 dark:border-white">
          <div className="text-lg text-black-20 dark:text-gray-70">{t("supported_devices")}</div>
          <span className='text-black-10 dark:text-white'> {t("devices_list")}</span>
        </li>

        <li className=" py-5 mb-2 border-t border-black-6 dark:border-white">
          <div className="text-lg text-black-20 dark:text-gray-70">{t("simultaneous_streams")}</div>
          <div>{devices}</div>
        </li>

        <li className=' py-5  border-t border-black-6 dark:border-white'>
          <div className=" text-black-20 dark:text-gray-70 "> {t("download_devices")}</div>
          <span className='text-black-10 dark:text-white'>{downloads}</span>
        </li>
        {spatialAudio && (
          <li className=' py-5  border-t border-black-6 dark:border-white'>
            <div className="  text-black-20 dark:text-gray-70 ">{t("spatial_audio")}</div>
            <span className='text-black-10 dark:text-white'>6</span>
          </li>
        )}
      </ul>
    </div>)
};


const Home = () => {
  const t = useTranslations('HomePage');

  //for device section 
  const deviceData = [
    { icon: <FaMobile />, title: 'smartPhone', descriptionKey: 'APPS-P' },
    { icon: <FaTablet />, title: 'Tablet', descriptionKey: 'APPS-P' },
    { icon: <MdOutlineLaptopChromebook />, title: 'Laptop', descriptionKey: 'APPS-P' },
    { icon: <IoTvSharp />, title: 'SmartTV', descriptionKey: 'APPS-P' },
    { icon: <GiConsoleController />, title: 'GamingConsole', descriptionKey: 'APPS-P' },
    { icon: <BsHeadsetVr />, title: 'VRHeadsets', descriptionKey: 'APPS-P' },
  ];

  //for question section
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const faqs = [
    { question: t("Q-ONE"), answer: t("A-ONE") },
    { question: t("Q-TWO"), answer: t("A-TWO") },
    { question: t("Q-THREE"), answer: t("A-THREE") },
    { question: t("Q-FOUR"), answer: t("A-FOUR") },
    { question: t("Q-FIVE"), answer: t("A-FIVE") },
    { question: t("Q-SIX"), answer: t("A-SIX") },
    { question: t("Q-SEVEN"), answer: t("A-SEVEN") },
    { question: t("Q-EIGHT"), answer: t("A-EIGHT") },
  ];

  //for plans section 
  const plans = [
    {
      style: ' bg-gradient-to-tr from-blue-800 to-blue-600',
      name: t("Basic_quality"),
      price: 70,
      resolution: '720p',
      devices: 1,
      downloads: 1,
    },
    {
      style: ' bg-gradient-to-tr from-blue-800 to-red-60',
      name: t("standard_quality"),
      price: 120,
      resolution: '1080p',
      devices: 2,
      downloads: 2,
    },
    {
      style: ' bg-gradient-to-tr from-blue-600 to-red-50',
      name: t("Premium_quality"),
      price: 165,
      resolution: '4K+HDR',
      devices: 4,
      downloads: 6,
      spatialAudio: true,
    },
  ];


  return (
    <>
      {/* bg- and logo  */}
      <div className='flex flex-col gap-4 w-[100%] h-screen mb-10'>
        <BgHome />

        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl md:text-5xl font-bold'>{t('SECTION-ONE-H1')}</h1>
          <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 p-4 max-w-4xl text-center'>{t('DES-ONE')}</p>
          <Button className='bg-red-50 text-white hover:bg-red-50'>
            <FaPlay /> {t("SECTION-ONE-BTN")}
          </Button>
        </div>
      </div>


      <section id='Home' className='container'>




        {/* for the popular movies */}
        <PMSECTION />

        <div className=' flex flex-col mt-20 gap-10'>
          <div className='flex flex-col'>
            <h1 className='text-2xl md:text-4xl font-bold'>{t('SECTION-TWO-H1')}</h1>
            <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 max-w-6xl'>{t('DES-TWO')}</p>
          </div>

          {/* apps  */}
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 text-white">
            {deviceData.map((device, index) => (
              <div key={index} className='w-full p-9 rounded-lg h-50 bg-gradient-to-tr from-60%  from-black-6 via-black-6 to-red-900 flex flex-col justify-evenly'>
                <div className='flex items-center gap-2'>
                  <div className='text-red-45 p-2 bg-gray-900 rounded-lg' style={{ fontSize: '35px' }}>
                    {device.icon}
                  </div>
                  <h1 className='text-base'>{t(device.title)}</h1>
                </div>
                <p className=' mt-2 text-sm text-white dark:text-gray-65'>{t(device.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* questions */}
        <div className="py-8  mt-10">
          <h2 className="text-3xl font-semibold mb-4"> {t("Q-H1")}</h2>
          <p className="text-gray-400  mb-6">{t("Q-P")}</p>
          <div className=" flex flex-wrap w-full ">
            {faqs.map((faq, index) => (
              <div key={index} className=" text-lg rounded-lg p-4 w-full  md:w-2/4 ">
                <button
                  className=" border-t border-red-45 pt-2 w-full flex justify-between items-center text-left   font-medium"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className='mt-2'>
                    <span className='bg-black-12 text-white p-2 rounded-md m-2'>{`${index + 1}`.toString().padStart(2, '0')} </span>
                    <span>{faq.question}</span>
                  </div>
                  <span className={`ml-2 transform ${activeIndex === index ? 'rotate-180' : ''}`}>
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === index && (
                  <p className="text-gray-400 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
          <button className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
            {t("Q-BTN")}
          </button>
        </div>


        {/* plans  */}
        <div className="  py-8">
          <h2 className=" text-2xl font-bold mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-2xl">
            {plans.map((plan) => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>


      </section>
    </>
  );
};

export default Home;



