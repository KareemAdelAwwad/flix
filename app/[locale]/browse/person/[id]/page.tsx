import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PersonDetailView from '@/components/PersonDetailView';
import { getPersonDetailBundle } from '@/lib/tmdb';
import { tmdbImage } from '@/utils/tmdbImage';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const person = await getPersonDetailBundle(id);
    return {
      title: person.name,
      description: person.biography?.slice(0, 160),
      openGraph: {
        title: person.name,
        description: person.biography?.slice(0, 160),
        images: person.profile_path
          ? [{ url: tmdbImage(person.profile_path, 'w500'), width: 500, height: 750 }]
          : [],
        url: `https://flix.kareemadel.com/${locale}/browse/person/${id}`,
        locale,
        type: 'profile',
      },
    };
  } catch {
    return { title: 'Person | Flix App' };
  }
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let person;
  try {
    person = await getPersonDetailBundle(id);
  } catch {
    notFound();
  }

  if (!person?.id) {
    notFound();
  }

  return <PersonDetailView person={person} />;
}