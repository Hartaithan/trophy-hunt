import { type BOARD_COLUMNS } from "./BoardModel";
import { type Platform } from "./PlatformModel";
import { type IProgressItem } from "./ProgressModel";

export interface IGame {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  image_url: string;
  platform: Platform;
  status: BOARD_COLUMNS;
  progress: IProgressItem[] | null;
  user_id: string;
  username: string;
  code: string;
  position: number;
}

export type INewGamePayload = Omit<
  IGame,
  "id" | "created_at" | "updated_at" | "progress" | "position"
>;

export interface IAddGamePayload {
  gameId: string;
  status: BOARD_COLUMNS;
}

export interface IReorderItem {
  id: number;
  position: number;
  status: BOARD_COLUMNS;
}

export interface IReorderPayload {
  items: IReorderItem[];
}
