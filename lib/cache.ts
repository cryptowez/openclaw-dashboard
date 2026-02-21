const responseCache = new Map();

export const getOrFetch = async (key: string, fetchFn: () => Promise<any>) => {
  if (responseCache.has(key)) return responseCache.get(key);
  const data = await fetchFn();
  responseCache.set(key, data);
  return data;
};