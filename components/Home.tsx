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
  mostPopular?: boolean;
}

function PlanCard({ style, name, price, resolution, devices, downloads, spatialAudio, mostPopular }: PlanCardProps) {
  const t = useTranslations('HomePage');
  const listStyle = `border-t border-black-6 pt-4 dark:border-black-30`
  const h1Style = `text-lg font-medium text-black-20 dark:text-gray-70`
  const pStyle = `text-xl font-medium text-black-10 dark:text-white`
  return (
    <div className={`relative bg-transparent border-black-6 borders hover:border-red-60 hover:shadow-2xl transition-all 
    p-4 pb-10 ${mostPopular && "rounded-t-none"} dark:bg-black-10 rounded-2xl shadow-md flex flex-col justify-between gap-10`}>
      {
        mostPopular && (
          <div className='bg-red-45 rounded-t-2xl absolute top-0 -translate-y-[100%] right-[50%] -translate-x-[-50%] w-[calc(100%+2.5px)] text-center text-base font-medium capitalize'>
            {t('most_popular')}
          </div>
        )
      }
      <div className={`${style} bg-red-50 rounded-xl p-4 pb-8`}>
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        <p className='text-white text-base font-bold'>{resolution}</p>
      </div>

      <ul className="list-none flex flex-col gap-4 justify-start px-4 ">
        <li className={`${listStyle} border-none`}>
          <h1 className={h1Style}>{t("monthly_price")}</h1>
          <p className={pStyle}>{price} {t('EGP')}</p>
        </li>

        <li className={listStyle}>
          <h1 className={h1Style}>{t("video_sound_quality")} </h1>
          <p className={pStyle}>{name === 'Premium' ? 'Best' : name === 'Standard' ? 'Great' : 'Good'}</p>
        </li>

        <li className={listStyle}>
          <h1 className={h1Style}>{t("supported_devices")}</h1>
          <p className={pStyle}> {t("devices_list")}</p>
        </li>

        <li className={listStyle}>
          <h1 className={h1Style}>{t("simultaneous_streams")}</h1>
          <p>{devices}</p>
        </li>

        <li className={listStyle}>
          <h1 className={h1Style}> {t("download_devices")}</h1>
          <p className={pStyle}>{downloads}</p>
        </li>
        {spatialAudio && (
          <li className={listStyle}>
            <div className={h1Style}>{t("spatial_audio")}</div>
            <p className={pStyle}>6</p>
          </li>
        )}
      </ul>

      <Button size={'lg'} className="bg-red-50 text-white hover:bg-red-60">
        {t("choose_plan")}
      </Button>
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
      style: ' bg-gradient-to-br from-blue-800 to-blue-600',
      name: t("Basic_quality"),
      price: 70,
      resolution: '720p',
      devices: 1,
      downloads: 1,
    },
    {
      style: 'bg-gradient-to-br from-blue-800 to-purple-600',
      name: t("standard_quality"),
      price: 120,
      resolution: '1080p',
      devices: 2,
      downloads: 2,
    },
    {
      style: ' bg-gradient-to-br from-blue-600 to-red-50',
      name: t("Premium_quality"),
      price: 165,
      resolution: '4K + HDR',
      devices: 4,
      downloads: 6,
      spatialAudio: true,
      mostPopular: true,
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
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {deviceData.map((device, index) => (
              <div key={index} className='w-full p-10 rounded-lg h-50 hover:scale-105 transition-transform
              bg-gradient-to-tr dark:from-black-6 dark:to-[#E5000020] from-70% flex flex-col justify-evenly borders'>
                <div className='flex items-center gap-2'>
                  <div className='text-red-45 p-2 dark:bg-black-8 bg-gray-90 rounded-lg' style={{ fontSize: '30px' }}>
                    {device.icon}
                  </div>
                  <h1 className='text-base'>{t(device.title)}</h1>
                </div>
                <p className='mt-2 text-sm text-gray-65'>{t(device.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* questions */}
        <div className="py-8  mt-10">
          <div className='flex justify-between'>
            <div>
              <h2 className="text-3xl font-semibold mb-4"> {t("Q-H1")}</h2>
              <p className="text-gray-60  mb-6">{t("Q-P")}</p>
            </div>
            <Button className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
              {t("Q-BTN")}
            </Button>
          </div>
          <div className=" flex flex-wrap w-full ">
            {faqs.map((faq, index) => (
              <div key={index} className=" text-lg rounded-lg p-4 w-full  md:w-2/4 ">
                <button
                  className={`${index > 1 && 'border-t'} border-red-45 pt-2 w-full flex justify-between items-center text-left font-medium`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className='mt-2 flex items-center'>
                    <span className='dark:bg-black-12 bg-gray-60 text-white p-3 px-4 rounded-lg mx-4 flex justify-center items-center font-semibold text-xl borders'>
                      <p>
                        {`${index + 1}`.toString().padStart(2, '0')}
                      </p>
                    </span>
                    <h6 className='font-medium text-[22px]'>{faq.question}</h6>
                  </div>
                  <span className={`ml-2 transform ${activeIndex === index ? 'rotate-180' : ''}`}>
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === index && (
                  <p className="text-gray-60 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* plans  */}
        <div className="py-8" id='subscriptions'>
          <h2 className=" text-3xl font-bold mb-6">{t('PLANS-TITLE')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-2xl">
            {plans.map((plan, index) => (
              <PlanCard {...plan} />
            ))}
          </div>
        </div>


      </section>
    </>
  );
};

export default Home;



