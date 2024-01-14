import { type MantineColor } from "@mantine/core";
import { type Game } from "./GameModel";
import { type Range } from "./UtilsModel";

export interface ColumnColor {
  color: MantineColor;
  shade: Range<0, 10>;
}

export enum BOARD_COLUMNS {
  Backlog = "backlog",
  InProgress = "progress",
  Platinum = "platinum",
  Complete = "complete",
}

export type BoardColumns = Record<BOARD_COLUMNS | string, Game[]>;

export type BoardCounts = Record<BOARD_COLUMNS | string, number>;

export interface BoardStats {
  counts: BoardCounts;
  backlogPercent: number;
}
