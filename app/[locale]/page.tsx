import {useTranslations} from 'next-intl';
import { ModeToggle } from '@/components/ModeToggle';
import { getLocale } from 'next-intl/server';
import Header from '@/components/Header';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <main>
      <div className="text-2xl text-center">{t('title')}</div>
      <Header />
      <section className='flex w-full justify-between bg-red-90 px-[20%]'>
        <ModeToggle />
      </section>
    </main>
  );
}
