import { ModeToggle } from '@/components/ModeToggle';

export default function Home() {
  return (
    <main>
      <div className="text-2xl text-center">Hello world!</div>
      <section className='flex w-full justify-between bg-red-90 px-[20%]'>
        <ModeToggle />

      </section>
    </main>
  );
}
