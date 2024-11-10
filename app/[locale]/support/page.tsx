"use client";
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/inputUA";
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

const page = () => {
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




  // for the webs3 forms 
  interface FormDataObject {
    [key: string]: FormDataEntryValue;
  }

  interface Web3FormsResponse {
    success: boolean;
    [key: string]: any;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("access_key", "cad749ab-463c-4e3c-a995-a02c477d7027");

    const object: FormDataObject = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    });

    const result: Web3FormsResponse = await response.json();
    if (result.success) {
      setEmailSent(true);
      console.log(result);
    }
  }


  //for the img 

  interface Movie {
    id: number;
    poster_path: string;
    title: string;
  }

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [emailSent, setEmailSent] = useState(false);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`,
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=1`, options)
          .then((response) => response.json())
          .then((data) => setPopularMovies(data.results));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);


  return (
    <section className="container">
      <title>Support</title>
      <div className='h-fit md:h-screen w-full flex flex-col md:flex-row justify-center items-center gap-10 max-w-screen-2xl'>
        {/* the img  */}
        <div className='h-96 md:h-full w-full md:w-2/4 flex flex-col justify-center gap-4' >

          <h1 className='text-2xl md:text-5xl font-bold md:w-[80%]'>Welcome to our support page! </h1>
          <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 max-w-4xl '>
            We're here to help you with any problems you may be having with our product.
          </p>


          <div className="relative md:h-2/5 w-full overflow-hidden 
          dark:bg-black-6 bg-gray-50 dark:border-black-12 border-gray-60 border-4 rounded-xl ">
            {/* Movie Posters Background */}
            <div className="absolute grid grid-cols-4 grid-rows-4 flex-wrap gap-4 p-2">
              {popularMovies.map((movie) => (
                <div className='g-2 rounded-lg overflow-hidden' >
                  <Image
                    key={movie.id}
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* -------------form---------------- */}
        <div className=" h-fit  w-full md:w-2/4 lg:w-3/4 mx-auto rounded-none md:rounded-2xl 
        p-4 md:p-8 shadow-input bg-white dark:bg-black-12 border-2 border-black-6">

          <form className="my-8" onSubmit={handleSubmit}>
            <input type="checkbox" name="botcheck" className="hidden"></input>
            <input type="hidden" name="subject" value="New Submission from Flix"></input>

            <div className='flex justify-between'>
              <LabelInputContainer className="mb-4  w-[48%]">
                <Label htmlFor="first">First Name</Label>
                <Input name='first' placeholder="Kareem" type="text" required />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4  w-[48%]">
                <Label htmlFor="last">Last Name</Label>
                <Input name='last' placeholder="Ibrahim" type="text" required />
              </LabelInputContainer>
            </div>


            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input placeholder="support@flix.com" type="email" name='email' required />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="massage">Massage</Label>
              <textarea name="massage" placeholder=' Enter Your Massage' required
                className='bg-gray-50 dark:bg-zinc-800 text-black dark:text-white  placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 p-2 rounded-lg' rows={5}></textarea>
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn dark:from-black-6 from-gray-90 dark:to-black-10 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              send  &rarr;
              <BottomGradient />
            </button>

            {
              emailSent &&
              <div className="mt-4 text-center text-green-600">
                <p>
                  Email sent successfully
                </p>
              </div>
            }

          </form>
        </div>

      </div>


      {/* questions */}
      <div className="mb-8">
        <div className='flex justify-between'>
          <div>
            <h2 className="text-3xl font-semibold mb-4"> {t("Q-H1")}</h2>
            <p className="text-gray-60  mb-6">{t("Q-P")}</p>
          </div>
          <Button className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700" size={'lg'}>
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
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-red-60 to-transparent" />
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
export default page
