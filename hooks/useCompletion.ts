import { type IProgressItem } from "@/models/ProgressModel";
import {
  useCongratulation,
  type CongratulationValue,
} from "@/providers/CongratulationProvider";
import { useEffect, useMemo, useRef } from "react";
import { useReward } from "react-rewards";

const rewardConfig = {
  spread: 100,
  startVelocity: 50,
  elementCount: 100,
};

const useCompletion = (progress: IProgressItem[]): boolean => {
  const { reward } = useReward("reward", "confetti", rewardConfig);
  const { show } = useCongratulation();

  const isMounted = useRef<boolean>(false);
  const allCount = useRef<number>(0);

  const isAllChecked = useMemo(() => {
    let base_count = 0;
    let all_count = 0;
    for (let i = 0; i < progress.length; i++) {
      const el = progress[i];
      base_count = base_count + (!el.dlc ? 1 : 0);
      all_count = all_count + (el.earned ? 1 : 0);
    }
    const countIsDecrement = all_count < allCount.current;
    allCount.current = all_count;
    let value: CongratulationValue | null = null;
    const isPlatinum = base_count === all_count;
    const isComplete = all_count === progress.length;
    if (isPlatinum) value = "platinum";
    if (isComplete) value = "complete";
    if (countIsDecrement) return isComplete;
    if (value === null) return isComplete;
    if (!isMounted.current) return isComplete;
    if (typeof window === "undefined") return isComplete;
    reward();
    show(value);
    return isComplete;
  }, [progress, reward, show]);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return isAllChecked;
};

export default useCompletion;
