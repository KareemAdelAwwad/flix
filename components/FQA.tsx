"use client";
import React,{useState} from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";

const FQA = () => {

    const t = useTranslations('HomePage');
 
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
  return (
    <section id="Questions" className="py-8  mt-10">
          <div className='flex justify-between'>
            <div>
              <h2 className="text-3xl font-semibold mb-4"> {t("Q-H1")}</h2>
              <p className="dark:text-gray-60 text-black-30 mb-6">{t("Q-P")}</p>
            </div>
            <Link href='/support'>
              <Button className="bg-red-600 text-white hover:bg-red-700" size={'lg'}>
                {t("Q-BTN")}
              </Button>
            </Link>
          </div>
          <div className=" flex flex-wrap w-full ">
            {faqs.map((faq, index) => (
              <div key={index} className=" text-lg rounded-lg p-4 w-full  md:w-2/4 ">
                <button
                  className={` ${index == 1 && 'md:border-none border-t'} ${index > 1 && 'border-t'} border-red-45 pt-2 w-full flex justify-between items-center text-left font-medium`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className='mt-2 flex items-center'>
                    <span className='dark:bg-black-12 bg-gray-60 text-white p-3 px-4 rounded-lg mx-4 flex justify-center items-center font-semibold text-xl borders'>
                      <p>
                        {`${index + 1}`.toString().padStart(2, '0')}
                      </p>
                    </span>
                    <h4 className='font-medium text-[22px]'>{faq.question}</h4>
                  </div>
                  <span className={`ml-2 transform ${activeIndex === index ? 'rotate-180' : ''}`}>
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === index && (
                  <p className="dark:text-gray-60 text-black-30 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>
  )
}

export default FQA
