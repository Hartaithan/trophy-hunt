import { type ProgressItem } from "@/models/ProgressModel";
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

const useCompletion = (progress: ProgressItem[]): boolean => {
  const { reward } = useReward("reward", "confetti", rewardConfig);
  const { show } = useCongratulation();

  const isMounted = useRef<boolean>(false);
  const prevCount = useRef<number>(-1);

  const isAllChecked = useMemo(() => {
    let baseCount = 0;
    let baseCompleted = 0;
    let totalCount = 0;
    let totalCompleted = 0;
    for (const item of progress) {
      if (!item.dlc) baseCount = baseCount + 1;
      if (!item.dlc && item.earned) baseCompleted = baseCompleted + 1;
      if (item.earned) totalCompleted = totalCompleted + 1;
      totalCount = totalCount + 1;
    }
    const countIsDecrement = totalCompleted < prevCount.current;
    prevCount.current = totalCompleted;
    let value: CongratulationValue | null = null;
    const isPlatinum =
      baseCount === baseCompleted && baseCount === totalCompleted;
    const isComplete = totalCompleted === progress.length;
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
