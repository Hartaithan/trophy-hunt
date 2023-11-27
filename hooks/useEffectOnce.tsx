import { useEffect, useRef } from "react";

const useEffectOnce = (fn: () => void): void => {
  const run = useRef(false);

  useEffect(() => {
    if (run.current) {
      fn();
    }
    return () => {
      run.current = true;
    };
  }, [fn]);
};

export default useEffectOnce;
