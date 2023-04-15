import { BOARD_COLUMNS, type IBoardColumn } from "@/models/BoardModel";
import { randomNum } from "./number";
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { type IGame } from "@/models/GameModel";

export const generateItems = (from: number, to: number): IGame[] => {
  const a = Array(to).fill(from);
  let b = from - 1;
  while (b < to) {
    const id = b + 1;
    const random = randomNum(1, 4);
    const size = random <= 2 ? "320/176" : "512/512";
    const columns = Object.values(BOARD_COLUMNS);
    const status = columns[random - 1];
    const item = {
      id,
      title: `Item ${id}`,
      image_url: `https://picsum.photos/${size}?random=${id}`,
      status,
    };
    a[b++] = item;
  }
  return a;
};

export const initializeBoard = (items: IGame[]): IBoardColumn => {
  const columns: IBoardColumn = {
    [BOARD_COLUMNS.Backlog]: [],
    [BOARD_COLUMNS.InProgress]: [],
    [BOARD_COLUMNS.Platinum]: [],
    [BOARD_COLUMNS.Complete]: [],
  };
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { status } = item;
    const column = columns[status];
    if (column === undefined) {
      continue;
    }
    columns[status].push(item);
  }
  const entries = Object.entries(columns);
  for (let i = 0; i < entries.length; i++) {
    const [key, items] = entries[i];
    columns[key] = [...items].sort((a, b) => a.order_index - b.order_index);
  }
  return columns;
};

export const moveBetweenContainers = (
  items: IBoardColumn,
  activeContainer: string,
  activeIndex: number,
  overContainer: string,
  overIndex: number,
  itemId: UniqueIdentifier
): IBoardColumn => {
  const item = items[activeContainer].find((item) => item.id === itemId);
  if (item === undefined) {
    return items;
  }
  return {
    ...items,
    [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
    [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
  };
};

export const removeAtIndex = (array: IGame[], index: number): IGame[] => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (
  array: IGame[],
  index: number,
  item: IGame
): IGame[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (
  array: IGame[],
  oldIndex: number,
  newIndex: number
): IGame[] => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};
