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

export interface IBoardItem {
  id: number;
  title: string;
  image_url: string;
  status: BOARD_COLUMNS;
}

export type IBoardColumn = Record<BOARD_COLUMNS, IBoardItem[]>;
