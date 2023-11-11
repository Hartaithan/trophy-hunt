import { type Game } from "@/models/GameModel";
import { type ProgressStats } from "@/models/ProgressModel";

export const emptyProgress: ProgressStats = {
  base: 0,
  baseCompleted: 0,
  baseProgress: 0,
  total: 0,
  totalCompleted: 0,
  totalProgress: 0,
};

export const calculateProgress = (
  progress: Game["progress"],
): ProgressStats => {
  if (progress === null) return emptyProgress;
  const array = [...progress];
  let base = 0;
  let baseCompleted = 0;
  let total = 0;
  let totalCompleted = 0;
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!item.dlc) {
      base = base + 1;
    }
    if (!item.dlc && item.earned) {
      baseCompleted = baseCompleted + 1;
    }
    if (item.earned) {
      totalCompleted = totalCompleted + 1;
    }
    total = total + 1;
  }
  return {
    base,
    baseCompleted,
    baseProgress: parseFloat(((baseCompleted * 100) / base).toFixed(1)),
    total,
    totalCompleted,
    totalProgress: parseFloat(((totalCompleted * 100) / total).toFixed(1)),
  };
};
