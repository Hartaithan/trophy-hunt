import { type BOARD_COLUMNS } from "./BoardModel";
import { type Platform } from "./PlatformModel";
import { type ProgressItem } from "./ProgressModel";
import { type Position } from "./PositionModel";

export interface Game {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  image_url: string;
  platform: Platform;
  status: BOARD_COLUMNS;
  progress: ProgressItem[] | null;
  user_id: string;
  username: string;
  code: string;
  position: Position | null;
}

export type NewGamePayload = Omit<
  Game,
  "id" | "created_at" | "updated_at" | "progress" | "position"
>;

export interface AddGameSearchPayload {
  id: string | null;
  platform: string | null;
  status: BOARD_COLUMNS | null;
  result?: string | null;
}

export interface AddGameCodePayload {
  code: string;
  isFifth: boolean;
  status: BOARD_COLUMNS;
}

export interface AddGameState {
  status: BOARD_COLUMNS | null;
  opened: boolean;
}

export interface ReorderItem {
  id: number;
  value: number;
  status: BOARD_COLUMNS;
}

export interface ReorderPayload {
  items: ReorderItem[];
}

export interface SplitSearchResult {
  id: string | null;
  platform: string | null;
  hash: string | null;
}
