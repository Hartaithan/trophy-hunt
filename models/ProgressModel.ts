export interface ProgressItem {
  id: number;
  earned: boolean;
  group: string;
  dlc: boolean;
}

export interface ProgressPayload {
  payload: ProgressItem[];
}

export type ProgressType = "platinum" | "complete";

export interface ProgressStats {
  base: number;
  baseCompleted: number;
  baseProgress: number;
  total: number;
  totalCompleted: number;
  totalProgress: number;
}
