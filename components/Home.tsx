"use client";
import React  from 'react';
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { FaPlay, FaMobile, FaTablet } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { BsHeadsetVr } from "react-icons/bs";
import { GiConsoleController } from "react-icons/gi";
import { IoTvSharp } from "react-icons/io5";
import PopularMoviesSection from "@/components/PopularMoviesSection"
import BgHome from "@/components/BgHome"
import { Link } from '@/i18n/routing';
import { useSubscriptionStore } from '@/store';
import { useSubscriptionCheck } from '@/hooks/useSubscriptionCheck';
import FQA from '@/components/FQA';

interface PlanCardProps {
  style: string;
  name: string;
  price: number;
  resolution: string;
  devices: number;
  downloads: number;
  spatialAudio?: boolean;
  mostPopular?: boolean;
  paymentLink: string;
}
function PlanCard({
  style,
  name,
  price,
  resolution,
  devices,
  downloads,
  spatialAudio,
  mostPopular,
  paymentLink
}: PlanCardProps) {
  const t = useTranslations('HomePage');
  const listStyle = `border-t border-black-6 pt-4 dark:border-black-30`
  const h1Style = `text-lg font-medium text-black-20 dark:text-gray-70`
  const pStyle = `text-xl font-medium text-black-10 dark:text-white`
  return (
    <div className={`relative bg-transparent border-black-6 borders hover:border-red-60 hover:shadow-2xl transition-all 
    p-4 pb-10 ${mostPopular && "rounded-t-none"} dark:bg-black-10 rounded-2xl shadow-md flex flex-col justify-between gap-10`}>
      {
        mostPopular && (
          <div className='bg-red-45 text-white rounded-t-2xl absolute top-0 -translate-y-[100%] right-[50%] -translate-x-[-50%] w-[calc(100%+2.5px)] text-center text-base font-medium capitalize'>
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

      <Link href={paymentLink} className='!w-full'>
        <Button size={'lg'} className="bg-red-50 text-white hover:bg-red-60 w-full">
          {t("choose_plan")}
        </Button>
      </Link>
    </div>)
};


const Home = () => {
  useSubscriptionCheck();
  const { isActive } = useSubscriptionStore();
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

 
   

  //for plans section 
  const plans = [
    {
      style: ' bg-gradient-to-br from-blue-800 to-blue-600',
      name: t("Basic_quality"),
      price: 70,
      resolution: '720p',
      devices: 1,
      downloads: 1,
      paymentLink: 'https://buy.stripe.com/test_8wMbJc1WY7zH39CcMO',
    },
    {
      style: 'bg-gradient-to-br from-blue-800 to-purple-600',
      name: t("standard_quality"),
      price: 120,
      resolution: '1080p',
      devices: 2,
      downloads: 2,
      paymentLink: 'https://buy.stripe.com/test_00gaF8cBCbPX7pS5kl',
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
      paymentLink: 'https://buy.stripe.com/test_8wMeVo59a9HP39CbII',
    },
  ];


  return (
    <>
      {/* bg- and logo  */}
      <div className='flex flex-col gap-4 w-[100%] h-screen mb-10'>
        <BgHome />

        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl md:text-5xl font-bold'>{t('SECTION-ONE-H1')}</h1>
          <p className='text-sm md:text-base dark:text-gray-60 text-black-30 p-4 max-w-4xl text-center'>{t('DES-ONE')}</p>
          <Link href={"/browse/movies"}>
            <Button className='bg-red-50 text-white hover:bg-red-50'>
              <FaPlay /> {t("SECTION-ONE-BTN")}
            </Button>
            </Link>
        </div>
      </div>

      <section id='Home' className='container'>
        {/* for the popular movies */}
        <section id='Categories'>
          <PopularMoviesSection />
        </section>

        <section id='Devices' className=' flex flex-col mt-20 gap-10'>
          <div className='flex flex-col'>
            <h1 className='text-2xl md:text-4xl font-bold'>{t('SECTION-TWO-H1')}</h1>
            <p className='text-sm md:text-base dark:text-gray-60 text-black-30 max-w-6xl'>{t('DES-TWO')}</p>
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
                  <h4 className='text-base font-semibold'>{t(device.title)}</h4>
                </div>
                <p className='mt-2 text-sm dark:text-gray-60 text-black-30'>{t(device.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* questions */}
        <FQA/>


        {/* plans  */}
        <section id='Plans'>
          {!isActive &&
            <div className="py-8" id='subscriptions'>
              <h2 className=" text-3xl font-bold mb-6">{t('PLANS-TITLE')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-2xl">
                {plans.map((plan, i) => (
                  <PlanCard {...plan} key={i} />
                ))}
              </div>
            </div>}
        </section>

      </section>
    </>
  );
};

export default Home;