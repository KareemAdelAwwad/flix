export type TmdbImageSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w300'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function tmdbImage(
  path: string | null | undefined,
  size: TmdbImageSize = 'w500',
  fallback: string = '/images/no-poster.svg'
): string {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path.startsWith('/') ? path : `/${path}`}`;
}

export function tmdbAvatar(
  avatarPath: string | null | undefined,
  fallback: string = '/images/robot-image.jpg'
): string {
  if (!avatarPath) return fallback;
  // TMDB returns external Gravatar URLs prefixed with a leading slash, e.g. "/https://secure.gravatar.com/..."
  if (avatarPath.startsWith('/http://') || avatarPath.startsWith('/https://')) {
    return avatarPath.slice(1);
  }
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  return `${TMDB_IMAGE_BASE}/w185${avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`}`;
}
