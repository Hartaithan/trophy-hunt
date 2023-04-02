import {
  BOARD_COLUMNS,
  type IBoardColumn,
  type IBoardItem,
} from "@/models/BoardModel";
import { randomNum } from "./number";

export const generateItems = (from: number, to: number): IBoardItem[] => {
  const items = Array.from(
    { length: to - from + 1 },
    (_, index): IBoardItem => {
      const random = randomNum(1, 4);
      const size = random <= 2 ? "320/176" : "512/512";
      const status = Object.entries(BOARD_COLUMNS)[
        random - 1
      ][1] as BOARD_COLUMNS;
      return {
        id: from + index,
        title: `Item ${from + index}`,
        image_url: `https://picsum.photos/${size}?random=${from + index}`,
        status,
      };
    }
  );
  return items;
};

export const initializeBoard = (items: IBoardItem[]): IBoardColumn => {
  const columns: IBoardColumn = {
    [BOARD_COLUMNS.Backlog]: [],
    [BOARD_COLUMNS.InProgress]: [],
    [BOARD_COLUMNS.Platinum]: [],
    [BOARD_COLUMNS.Complete]: [],
  };
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { status } = item;
    columns[status].push(item);
  }
  return columns;
};
