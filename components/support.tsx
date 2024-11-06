"use client";
import React, { useState ,useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/inputUA";
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { cn } from "@/lib/utils";
import Image from 'next/image';
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
  



// for the webs3 forms 
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


    //for the img 

    interface Movie {
      id: number;
      poster_path: string;
      title: string;
    }
  
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  
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
          const responses = await Promise.all([
            fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=1`, options),
            fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=2`, options)
          ]);
  
          const data = await Promise.all(responses.map(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          }));
  
          const movies = [...data[0].results, ...data[1].results].slice(0, 30);
          setPopularMovies(movies);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      };
  
      fetchMovies();
    }, []);
  

      return (
     <section className=" px-6">

 <div className=' h-fit md:h-screen w-full flex flex-col md:flex-row justify-center items-center gap-10 max-w-screen-2xl'>
    {/* the img  */}
  <div className=' h-96 md:h-full w-full  md:w-2/4  flex  flex-col items-center justify-center ' > 

  <h1 className='text-2xl md:text-5xl font-bold'>Welcome to our support page! </h1>
  <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 p-4 max-w-4xl '>
    We're here to help you with any problems you may be having with our product.
  </p>
         
          
          <div className="relative h-5/6 md:h-2/5 w-full overflow-hidden  bg-black-6 border-black-12 border-8 rounded-lg ">
      {/* Movie Posters Background */}
      <div className="absolute grid  grid-cols-4 flex-wrap gap-6  ">
        {popularMovies.map((movie) => (
          <div className='' >
            <Image
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              width={150}
              height={150}
              className="object-cover w-full h-full rounded-xl opacity-70"
            />
          </div>
        ))}
      </div>
    </div>

</div>

    {/* -------------form---------------- */}
                <div className=" h-fit  w-full md:w-2/4 lg:w-3/4 mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black-12 border-2 border-black-6">
              
              <form className="my-8" onSubmit={handleSubmit}>
               
                  <LabelInputContainer className="mb-4  shadow-lg dark:shadow-none">
                    <Label htmlFor="name">Your Name</Label>
                    <Input name='name' placeholder="Tyler Ali" type="text" />
                  </LabelInputContainer>
           
             
                <LabelInputContainer className="mb-4 shadow-lg dark:shadow-none">
                  <Label htmlFor="email">Email Address</Label>
                  <Input placeholder="projectmayhem@fc.com" type="email" name='email'/>
                </LabelInputContainer>
                
                <LabelInputContainer className="mb-4 shadow-lg dark:shadow-none">
                  <Label htmlFor="Massage">Massage</Label>
                  {/* <Input placeholder=" Enter Your Massage" type="Massage" name='massage'  /> */}
                  <textarea name="massage" placeholder=' Enter Your Massage' className='bg-gray-50 dark:bg-zinc-800 text-black dark:text-white  placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 p-2 rounded-lg' rows={8}></textarea>
                </LabelInputContainer>
                <button
                  className="bg-gradient-to-br relative group/btn from-black-6 dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  send  &rarr;
                  <BottomGradient />
                </button>
      
              </form>
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
