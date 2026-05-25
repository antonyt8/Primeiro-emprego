import { useEffect, useState } from "react";

export const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = globalThis.setTimeout(() => setDebouncedValue(value), delay);
    return () => globalThis.clearTimeout(handle);
  }, [delay, value]);

  return debouncedValue;
};