export const readJson = <T,>(key: string): T | null => {
  const raw = globalThis.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    globalThis.localStorage.removeItem(key);
    return null;
  }
};

export const writeJson = (key: string, value: unknown) => {
  globalThis.localStorage.setItem(key, JSON.stringify(value));
};
