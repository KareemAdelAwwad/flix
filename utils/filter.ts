// Function that taks the title ID and block it if it's certficate >= 18
import { MovieCertification, SeriesCertification } from '@/types/titleCertification';
import { Title } from '@/types/title';

const BLOCKED_CERTIFICATION =
  [
    "18+",
    "18",
    "21",
    "R",
    "MA15+",
    "K-18",
    "18A",
    "R18",
    "III",
    "D",
    "A",
    "VM18",
    "R18+",
    "청소년관람불가",
    "N-18",
    "Btl",
    "R21",
    "X",
    "M/18",
    "NC-17",
    "20",
    "限制級"
];

const BLOCKED_KEYWORDS = [
  // Original keywords
  "Porn",
  "Porno",
  "Pornographer",
  "Sex",
  "Nude",
  "Nudity",
  "Erotic",
  "Adult",
  "XXX",
  
  // Adult content variations
  "Hardcore",
  "Softcore",
  "NSFW",
  "18+",
  "X-Rated",
  "Adults Only",
  "Uncensored",

  // Sexual terms
  "Sexual",
  "Sexuality",
  
  // Adult industry terms
  "Playboy",
  "Penthouse",
  "Hustler",
  "Adult Film",
  "Blue Movie",
  "Stag Film",
  "Skin Flick",
  
  // Explicit body-related terms
  "Topless",
  "Bottomless",
  "Naked",
  "Undressed",
  "Unclothed",
  
  // Adult entertainment
  "Strip",
  "Stripper",
  "Striptease",
  "Peep Show",
  "Red Light District",
  
  // Adult romance/BDSM
  "Kinky",
  "Fetish",
  "BDSM",
  "Bondage",
  
  // Adult entertainment venues
  "Brothel",
  "Escort",
  "Strip Club",
  "Massage Parlor",
  
  // Content warnings
  "Strong Sexual Content",
  "Sexual Situations",
  "Brief Nudity",
  "Partial Nudity",
  "Full Nudity",
  "Sexual Violence",
  "Graphic Sexual Content",
  
  // International adult terms
  "Hentai", // Japanese
  "Ecchi", // Japanese
  "Yaoi", // Japanese
  "Yuri", // Japanese
  "Erotica",
  "Erotik", // German
  "Érotique", // French
  "Erótico", // Spanish/Portuguese
  
  // Explicit slang
  "Risqué",
  
  // Age restrictions
  "NC-17",
  "Unrated Adult"
];

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`,
  }
};


export async function isBlocked(titleId: number, titleName: string, titleType: 'movie' | 'series'): Promise<boolean> {
  // Check if the title name contains any blocked keywords
  const lowerCaseTitleName = titleName.toLowerCase();
  const containsBlockedKeyword = BLOCKED_KEYWORDS.some(keyword => lowerCaseTitleName.includes(keyword.toLowerCase()));
  if (containsBlockedKeyword) {
    return true;
  }

  // Check title keywords for blocking criteria
  const keywordsUrl = `https://api.themoviedb.org/3/${titleType === 'movie' ? 'movie' : 'tv'}/${titleId}/keywords`;
  try {
    const response = await fetch(keywordsUrl, options);
    const data = await response.json();
    const containsBlockedKeywordInKeywords = data.keywords.some((keyword: { name: string }) => 
      BLOCKED_KEYWORDS.some(blockedKeyword => keyword.name.toLowerCase().includes(blockedKeyword.toLowerCase()))
    );
    if (containsBlockedKeywordInKeywords) {
      return true;
    }
  } catch (error) {
    console.error('Error fetching keywords:', error);
  }

  // Fetch the certification data based on title type
  const SeriesURL = `https://api.themoviedb.org/3/tv/${titleId}/content_ratings`;
  const MovieURL = `https://api.themoviedb.org/3/movie/${titleId}/release_dates`;
  const url = titleType === 'movie' ? MovieURL : SeriesURL;

  try {
    const response = await fetch(url, options);
    const data: MovieCertification | SeriesCertification = await response.json();
    if (titleType === 'movie') {
      const certifications = (data as MovieCertification).results;
      // loop over all certifications and check if any of them is in the blocked list, after that compare the persantage of blocked certifications with the total number of certifications
      // if more than 50% of the certifications are blocked, then block the movie
      const blockedCount = certifications.filter(cert => {
        return BLOCKED_CERTIFICATION.includes(cert.release_dates[0].certification || '');
      }).length;
      const totalCount = certifications.length;
      const blockedPercentage = (blockedCount / totalCount) * 100;
      if (blockedPercentage > 50) {
        return true;
      }
    }
    else {
      const certifications = (data as SeriesCertification).results;
      // loop over all certifications and check if any of them is in the blocked list
      const blockedCount = certifications.filter(cert => {
        return BLOCKED_CERTIFICATION.includes(cert.rating || '');
      }).length;
      const totalCount = certifications.length;
      const blockedPercentage = (blockedCount / totalCount) * 100;
      if (blockedPercentage > 50) {
        return true;
      }
    }
  } catch (error) {
    console.error('Error fetching certification:', error);
  }
  return false;
}

export async function filterBlockedTitles(titles: Title[], titleType: 'movie' | 'series'): Promise<Title[]> {
  const filteredTitles: Title[] = [];
  for (const title of titles) {
    const blocked = await isBlocked(
      title.id,
      titleType === "movie" ? (title.title ?? "") : (title.name ?? ""),
      titleType
    );
    if (!blocked) {
      filteredTitles.push(title);
    }
  }
  console.log(`Filtered titles: ${filteredTitles.length} out of ${titles.length}`);
  return filteredTitles;
}