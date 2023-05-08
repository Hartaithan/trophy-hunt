import { type IGame } from "@/models/GameModel";
import { type IProgressStats } from "@/models/ProgressModel";

export const emptyProgress: IProgressStats = {
  base: 0,
  baseCompleted: 0,
  baseProgress: 0,
  total: 0,
  totalCompleted: 0,
  totalProgress: 0,
};

export const calculateProgress = (
  progress: IGame["progress"]
): IProgressStats => {
  if (progress === null) return emptyProgress;
  const result: IProgressStats = [...progress].reduce((acc, i) => {
    if (!i.dlc) {
      acc.base = acc.base + 1;
    }
    if (!i.dlc && i.earned) {
      acc.baseCompleted = acc.baseCompleted + 1;
    }
    if (i.earned) {
      acc.totalCompleted = acc.totalCompleted + 1;
    }
    acc.total = acc.total + 1;
    return acc;
  }, emptyProgress);
  return {
    ...result,
    baseProgress: parseFloat(
      ((result.baseCompleted * 100) / result.base).toFixed(1)
    ),
    totalProgress: parseFloat(
      ((result.totalCompleted * 100) / result.total).toFixed(1)
    ),
  };
};
