import { type PayloadObject } from "@/utils/payload";

export interface ProgressItem {
  id: number;
  earned: boolean;
  group: string;
  dlc: boolean;
}

export interface ProgressPayload extends PayloadObject {
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
