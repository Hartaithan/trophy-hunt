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
  const allCount = useRef<number>(0);

  const isAllChecked = useMemo(() => {
    let base_count = 0;
    let base_completed = 0;
    let total_count = 0;
    let total_completed = 0;
    for (let i = 0; i < progress.length; i++) {
      const item = progress[i];
      if (!item.dlc) base_count = base_count + 1;
      if (!item.dlc && item.earned) base_completed = base_completed + 1;
      if (item.earned) total_completed = total_completed + 1;
      total_count = total_count + 1;
    }
    const countIsDecrement = total_count < allCount.current;
    allCount.current = total_count;
    let value: CongratulationValue | null = null;
    const isPlatinum =
      total_completed <= base_completed && base_count === base_completed;
    const isComplete = total_completed === progress.length;
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
