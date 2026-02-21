import { getExpirationDate } from './utils';

const responseCache = new Map<string, CachedResponse>();

interface CachedResponse {
  data: any;
  expiresAt: Date;
}

export const getOrFetch = async <T>(
  key: string, 
  fetchFn: () => Promise<T>,
  ttl: string = '15m'
): Promise<T> => {
  const expirationDate = getExpirationDate(ttl);
  if (responseCache.has(key) && responseCache.get(key)!.expiresAt > new Date()) {
    return responseCache.get(key)!.data as T;
  }

  const data = await fetchFn();
  responseCache.set(key, { data, expiresAt: expirationDate });
  return data;
};

export const clearExpiredCache = () => {
  const now = new Date();
  for (const [key, { expiresAt }] of responseCache) {
    if (expiresAt <= now) {
      responseCache.delete(key);
    }
  }
};