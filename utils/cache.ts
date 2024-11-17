interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const setCache = <T>(key: string, data: T): void => {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
};

export const getCache = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const cacheItem: CacheItem<T> = JSON.parse(cached);
  const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return cacheItem.data;
};