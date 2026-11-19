'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FQA from '@/components/FQA';
import { tmdbImage } from '@/utils/tmdbImage';

export interface SupportTrendingMovie {
  id: number;
  poster_path: string | null;
  title: string;
}

interface SupportViewProps {
  movies: SupportTrendingMovie[];
}

interface Web3FormsResponse {
  success: boolean;
  [key: string]: unknown;
}

const SupportView: React.FC<SupportViewProps> = ({ movies }) => {
  const sTranslation = useTranslations('Support');
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.append('access_key', 'cad749ab-463c-4e3c-a995-a02c477d7027');

      const object = Object.fromEntries(formData);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(object),
      });

      const result: Web3FormsResponse = await response.json();
      if (result.success) {
        setEmailSent(true);
        event.currentTarget.reset();
      }
    } catch (error) {
      console.error('Support form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container">
      <div className="h-fit md:h-screen w-full flex flex-col md:flex-row justify-center items-center gap-10 max-w-screen-2xl">
        <div className="h-full w-full md:w-2/4 flex flex-col justify-center gap-4">
          <h1 className="text-2xl md:text-5xl font-bold md:w-[80%]">
            {sTranslation('contact')}
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-65 max-w-4xl">
            {sTranslation('contactP')}
          </p>

          <div
            className="relative md:h-2/5 w-full overflow-hidden md:block hidden
          dark:bg-black-6 bg-gray-50 dark:border-black-12 border-gray-60 border-4 rounded-xl"
          >
            <div className="absolute grid grid-cols-4 grid-rows-4 flex-wrap gap-4 p-2">
              {movies.map((movie) => (
                <div className="g-2 rounded-lg overflow-hidden" key={movie.id}>
                  <Image
                    src={tmdbImage(movie.poster_path, 'w300')}
                    alt={movie.title}
                    width={150}
                    height={150}
                    loading="lazy"
                    className="object-cover w-full h-full pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="contact-form"
          className="h-fit w-full md:w-2/4 lg:w-3/4 mx-auto rounded-2xl
        p-4 md:p-8 shadow-input bg-white dark:bg-black-12 border-2 border-black-6"
        >
          <form className="my-8" onSubmit={handleSubmit}>
            <input type="checkbox" name="botcheck" className="hidden" />
            <input type="hidden" name="subject" value="New Submission from Flix" />

            <div className="flex justify-between">
              <LabelInputContainer className="mb-4 w-[48%]">
                <Label htmlFor="first">{sTranslation('contactForm.fName')}</Label>
                <Input
                  id="first"
                  name="first"
                  placeholder={sTranslation('contactFormPlacholder.fName')}
                  type="text"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4 w-[48%]">
                <Label htmlFor="last">{sTranslation('contactForm.lName')}</Label>
                <Input
                  id="last"
                  name="last"
                  placeholder={sTranslation('contactFormPlacholder.lName')}
                  type="text"
                  required
                />
              </LabelInputContainer>
            </div>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">{sTranslation('contactForm.email')}</Label>
              <Input
                id="email"
                placeholder={sTranslation('contactFormPlacholder.email')}
                type="email"
                name="email"
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="message">{sTranslation('contactForm.message')}</Label>
              <textarea
                id="message"
                name="message"
                placeholder={sTranslation('contactFormPlacholder.message')}
                required
                className="bg-gray-50 dark:bg-zinc-800 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 p-2 rounded-lg"
                rows={5}
              />
            </LabelInputContainer>

            <button
              className="bg-gradient-to-br relative group/btn dark:from-black-6 from-gray-90 dark:to-black-10 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {sTranslation('contactForm.send')}
              <BottomGradient />
            </button>

            {emailSent && (
              <div className="mt-4 text-center text-green-600">
                <p>{sTranslation('contactSuccess')}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      <FQA />
    </section>
  );
};

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-red-60 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn('flex flex-col space-y-2 w-full', className)}>{children}</div>;

export default SupportView;
