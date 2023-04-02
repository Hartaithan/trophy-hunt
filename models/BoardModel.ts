export enum BOARD_COLUMNS {
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
  id: number;
  title: BOARD_COLUMNS;
  items: IBoardItem[];
}
