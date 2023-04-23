import { type MantineColor } from "@mantine/core";
import { type IGame } from "./GameModel";
import { type Range } from "@/helpers/types";

export interface IColumnColor {
  color: MantineColor;
  shade: Range<0, 10>;
}

export enum BOARD_COLUMNS {
  Backlog = "backlog",
  InProgress = "progress",
  Platinum = "platinum",
  Complete = "complete",
}

export type IBoardColumns = Record<BOARD_COLUMNS | string, IGame[]>;
