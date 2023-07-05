export interface IProgressItem {
  id: number;
  earned: boolean;
  group: string;
  dlc: boolean;
}

export interface IProgressPayload {
  payload: IProgressItem[];
}

export type ProgressType = "platinum" | "complete";

export interface IProgressStats {
  base: number;
  baseCompleted: number;
  baseProgress: number;
  total: number;
  totalCompleted: number;
  totalProgress: number;
}
