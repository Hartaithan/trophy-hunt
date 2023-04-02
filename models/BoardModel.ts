export enum BOARD_COLUMNS {
  Backlog = "backlog",
  InProgress = "progress",
  Platinum = "platinum",
  Complete = "complete",
}

export enum BOARD_COLUMNS_LABELS {
  Backlog = "Backlog",
  InProgress = "In Progress",
  Platinum = "Platinum",
  Complete = "100%",
}

export interface IBoardItem {
  id: number;
  title: string;
  image_url: string;
}

export interface IBoardColumn {
  id: BOARD_COLUMNS;
  label: BOARD_COLUMNS_LABELS;
  items: IBoardItem[];
}
