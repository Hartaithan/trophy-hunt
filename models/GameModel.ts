import { type BOARD_COLUMNS } from "./BoardModel";

export interface IGame {
  id: number;
  created_at: string;
  updated_at: string;
  ordered_at: string;
  title: string;
  image_url: string;
  platform: string;
  status: BOARD_COLUMNS;
  progress: string;
  user_id: string;
  code: string;
  order: number;
}

export type INewGamePayload = Omit<
  IGame,
  "id" | "created_at" | "updated_at" | "ordered_at" | "progress" | "order"
>;

export interface IAddGamePayload {
  gameId: string;
  status: BOARD_COLUMNS;
}

export interface IReorderItem {
  id: number;
  order: number;
}

export interface IReorderPayload {
  payload: IReorderItem[];
}
