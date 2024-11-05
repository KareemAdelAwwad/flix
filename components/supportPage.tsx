"use client";
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/inputUA";
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
 
const supportPage = () => {
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log("Form submitted");
    //   };
    
    const t = useTranslations('HomePage');


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
  




      async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: json
        });
        const result = await response.json();
        if (result.success) {
            console.log(result);
        }
    }

      return (
     <section className="">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black-12">
              <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Welcome to Aceternity
              </h2>
              <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Login to aceternity if you can because we don&apos;t have a login flow
                yet
              </p>
        
              <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstname">First name</Label>
                    <Input id="firstname" placeholder="Tyler" type="text" />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastname">Last name</Label>
                    <Input id="lastname" placeholder="Durden" type="text" />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                  <Label htmlFor="twitterpassword">Your twitter password</Label>
                  <Input
                    id="twitterpassword"
                    placeholder="••••••••"
                    type="twitterpassword"
                  />
                </LabelInputContainer>
        
                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Sign up &rarr;
                  <BottomGradient />
                </button>
        
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        
                <div className="flex flex-col space-y-4">
                  <button
                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="submit"
                  >
                    <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      GitHub
                    </span>
                    <BottomGradient />
                  </button>
                  <button
                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="submit"
                  >
                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Google
                    </span>
                    <BottomGradient />
                  </button>
                  <button
                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="submit"
                  >
                    <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      OnlyFans
                    </span>
                    <BottomGradient />
                  </button>
                </div>
              </form>
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

        
        </section>
      );
    }
     
    const BottomGradient = () => {
      return (
        <>
          <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
      );
    };
     
    const LabelInputContainer = ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => {
      return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
          {children}
        </div>
      );
    };
export default supportPage
