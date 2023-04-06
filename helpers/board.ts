import {
  BOARD_COLUMNS,
  type IBoardColumn,
  type IBoardItem,
} from "@/models/BoardModel";
import { randomNum } from "./number";
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";
import { type UniqueIdentifier } from "@dnd-kit/core";

export const generateItems = (from: number, to: number): IBoardItem[] => {
  const a = Array(to).fill(from);
  let b = from - 1;
  while (b < to) {
    const id = b + 1;
    const random = randomNum(1, 4);
    const size = random <= 2 ? "320/176" : "512/512";
    const columns = Object.values(BOARD_COLUMNS);
    const status = columns[random - 1] as BOARD_COLUMNS;
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

export const removeAtIndex = (
  array: IBoardItem[],
  index: number
): IBoardItem[] => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (
  array: IBoardItem[],
  index: number,
  item: IBoardItem
): IBoardItem[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (
  array: IBoardItem[],
  oldIndex: number,
  newIndex: number
): IBoardItem[] => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};
