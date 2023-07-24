import { useCallback, useRef } from "react";

const useDebounce = (
  fn: (...args: any[]) => void,
  delay: number
): ((...args: any[]) => void) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debounceCallback = useCallback(
    (...args: any[]) => {
      if (timer.current != null) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );

  return debounceCallback;
};

export default useDebounce;
