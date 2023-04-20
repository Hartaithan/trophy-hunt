import { type IGame } from "./GameModel";

export enum BOARD_COLUMNS {
  Backlog = "backlog",
  InProgress = "progress",
  Platinum = "platinum",
  Complete = "complete",
}

export const columnsLabels: Record<BOARD_COLUMNS, string> = {
  [BOARD_COLUMNS.Backlog]: "Backlog",
  [BOARD_COLUMNS.InProgress]: "In Progress",
  [BOARD_COLUMNS.Platinum]: "Platinum",
  [BOARD_COLUMNS.Complete]: "100%",
};

export type IBoardColumns = Record<BOARD_COLUMNS | string, IGame[]>;
