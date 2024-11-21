"use client";
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/inputUA";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import FQA from '@/components/FQA';


const page = () => {
  const t = useTranslations('HomePage');
  const sTranslation = useTranslations('Support');

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
      <title>{sTranslation('title')}</title>
      <div className='h-fit md:h-screen w-full flex flex-col md:flex-row justify-center items-center gap-10 max-w-screen-2xl'>
        {/* the img  */}
        <div className='h-full w-full md:w-2/4 flex flex-col justify-center gap-4' >

          <h1 className='text-2xl md:text-5xl font-bold md:w-[80%]'>{sTranslation('contact')}</h1>
          <p className='text-sm md:text-base text-gray-500 dark:text-gray-65 max-w-4xl '>
            {sTranslation('contactP')}
          </p>


          <div className="relative md:h-2/5 w-full overflow-hidden md:block hidden
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
        <div id='contact-form'
          className=" h-fit w-full md:w-2/4 lg:w-3/4 mx-auto rounded-2xl 
        p-4 md:p-8 shadow-input bg-white dark:bg-black-12 border-2 border-black-6">

          <form className="my-8" onSubmit={handleSubmit}>
            <input type="checkbox" name="botcheck" className="hidden"></input>
            <input type="hidden" name="subject" value="New Submission from Flix"></input>

            <div className='flex justify-between'>
              <LabelInputContainer className="mb-4  w-[48%]">
                <Label htmlFor="first">{sTranslation('contactForm.fName')}</Label>
                <Input name='first' placeholder={sTranslation('contactFormPlacholder.fName')} type="text" required />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4  w-[48%]">
                <Label htmlFor="last">{sTranslation('contactForm.lName')}</Label>
                <Input name='last' placeholder={sTranslation('contactFormPlacholder.fName')} type="text" required />
              </LabelInputContainer>
            </div>


            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">{sTranslation('contactForm.email')}</Label>
              <Input placeholder={sTranslation('contactFormPlacholder.email')} type="email" name='email' required />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="massage">{sTranslation('contactForm.message')}</Label>
              <textarea name="massage" placeholder={sTranslation('contactFormPlacholder.message')} required
                className='bg-gray-50 dark:bg-zinc-800 text-black dark:text-white  placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 p-2 rounded-lg' rows={5}></textarea>
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn dark:from-black-6 from-gray-90 dark:to-black-10 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit">
              {sTranslation('contactForm.send')}
              <BottomGradient />
            </button>

            {
              emailSent &&
              <div className="mt-4 text-center text-green-600">
                <p>
                  {sTranslation('contactSuccess')}
                </p>
              </div>
            }

          </form>
        </div>

      </div>


      {/* questions */}
       <FQA id='Questions'/>


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
