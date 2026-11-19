import { MovieCertification, SeriesCertification } from '@/types/titleCertification';
import { Title } from '@/types/title';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function isAdminUser(userEmail: string | null | undefined): boolean {
  if (!userEmail || !ADMIN_EMAIL) return false;
  return userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

const BLOCKED_CERTIFICATION = new Set([
  '18+',
  '18',
  '21',
  'R',
  'MA15+',
  'K-18',
  '18A',
  'R18',
  'III',
  'D',
  'A',
  'VM18',
  'R18+',
  '청소년관람불가',
  'N-18',
  'Btl',
  'R21',
  'X',
  'M/18',
  'NC-17',
  '20',
  '限制級',
]);

const BLOCKED_KEYWORDS = [
  'porn',
  'porno',
  'pornographer',
  'sex',
  'nude',
  'nudity',
  'erotic',
  'adult',
  'xxx',
  'hardcore',
  'softcore',
  'nsfw',
  '18+',
  'x-rated',
  'adults only',
  'uncensored',
  'sexual',
  'sexuality',
  'playboy',
  'penthouse',
  'hustler',
  'adult film',
  'blue movie',
  'stag film',
  'skin flick',
  'topless',
  'bottomless',
  'naked',
  'undressed',
  'unclothed',
  'strip',
  'stripper',
  'striptease',
  'peep show',
  'red light district',
  'kinky',
  'fetish',
  'bdsm',
  'bondage',
  'brothel',
  'escort',
  'strip club',
  'massage parlor',
  'strong sexual content',
  'sexual situations',
  'brief nudity',
  'partial nudity',
  'full nudity',
  'sexual violence',
  'graphic sexual content',
  'hentai',
  'ecchi',
  'yaoi',
  'yuri',
  'erotica',
  'erotik',
  'érotique',
  'erótico',
  'risqué',
  'nc-17',
  'unrated adult',
];

function hasBlockedKeywordText(text: string | undefined | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
}

export function isBlockedFromDetails(params: {
  titleName: string;
  titleType: 'movie' | 'series';
  adult?: boolean;
  keywords?: { name: string }[];
  releaseDates?: MovieCertification['results'];
  contentRatings?: SeriesCertification['results'];
  userEmail?: string | null;
}): boolean {
  if (isAdminUser(params.userEmail)) return false;
  if (params.adult) return true;
  if (hasBlockedKeywordText(params.titleName)) return true;

  if (params.keywords?.some((kw) => hasBlockedKeywordText(kw.name))) {
    return true;
  }

  if (params.titleType === 'movie' && params.releaseDates?.length) {
    const valid = params.releaseDates.filter((c) => c.release_dates?.length > 0);
    if (valid.length > 0) {
      const blockedCount = valid.filter((c) =>
        BLOCKED_CERTIFICATION.has(c.release_dates[0]?.certification || '')
      ).length;
      if ((blockedCount / valid.length) * 100 > 50) return true;
    }
  }

  if (params.titleType === 'series' && params.contentRatings?.length) {
    const blockedCount = params.contentRatings.filter((c) =>
      BLOCKED_CERTIFICATION.has(c.rating || '')
    ).length;
    if ((blockedCount / params.contentRatings.length) * 100 > 50) return true;
  }

  return false;
}

function getTmdbHeaders(): Record<string, string> {
  const token =
    process.env.TMDB_API_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN;
  return {
    accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function isBlocked(
  titleId: number,
  titleName: string,
  titleType: 'movie' | 'series',
  userEmail?: string | null
): Promise<boolean> {
  if (isAdminUser(userEmail)) return false;
  if (hasBlockedKeywordText(titleName)) return true;

  const headers = getTmdbHeaders();
  const fetchInit = { headers, next: { revalidate: 86400 } } as RequestInit & {
    next: { revalidate: number };
  };

  const keywordsUrl = `https://api.themoviedb.org/3/${titleType === 'movie' ? 'movie' : 'tv'}/${titleId}/keywords`;
  const certUrl =
    titleType === 'movie'
      ? `https://api.themoviedb.org/3/movie/${titleId}/release_dates`
      : `https://api.themoviedb.org/3/tv/${titleId}/content_ratings`;

  try {
    const [kwRes, certRes] = await Promise.all([
      fetch(keywordsUrl, fetchInit),
      fetch(certUrl, fetchInit),
    ]);

    const kwData = kwRes.ok ? await kwRes.json() : {};
    const keywords: { name: string }[] = kwData.keywords || kwData.results || [];
    if (keywords.some((kw) => hasBlockedKeywordText(kw.name))) {
      return true;
    }

    const certData = certRes.ok ? await certRes.json() : {};
    if (titleType === 'movie') {
      const results = (certData as MovieCertification).results || [];
      return isBlockedFromDetails({
        titleName,
        titleType,
        releaseDates: results,
        userEmail,
      });
    } else {
      const results = (certData as SeriesCertification).results || [];
      return isBlockedFromDetails({
        titleName,
        titleType,
        contentRatings: results,
        userEmail,
      });
    }
  } catch (error) {
    console.error('Error checking blocked status:', error);
    return false;
  }
}

export async function filterBlockedTitles<T extends Title & { adult?: boolean }>(
  titles: T[],
  titleType: 'movie' | 'series',
  userEmail?: string | null
): Promise<T[]> {
  if (isAdminUser(userEmail) || !titles?.length) {
    return titles ?? [];
  }

  // Fast synchronous pre-filter before any network calls
  const candidates = titles.filter((item) => {
    if (item.adult) return false;
    const name = titleType === 'movie' ? item.title ?? '' : item.name ?? '';
    return !hasBlockedKeywordText(name);
  });

  // Bounded concurrency (chunks of 6) with 24h Next.js Data Cache
  const CONCURRENCY = 6;
  const filtered: T[] = [];

  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const chunk = candidates.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      chunk.map(async (item) => {
        const name = titleType === 'movie' ? item.title ?? '' : item.name ?? '';
        const blocked = await isBlocked(item.id, name, titleType, userEmail);
        return blocked ? null : item;
      })
    );
    for (const item of results) {
      if (item) filtered.push(item);
    }
  }

  return filtered;
}