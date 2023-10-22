import { type MouseEvent } from "react";
import { BOARD_COLUMNS, type BoardColumns } from "@/models/BoardModel";
import { randomNum } from "./number";
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";
import {
  type UniqueIdentifier,
  PointerSensor as LibPointerSensor,
} from "@dnd-kit/core";
import { type Game } from "@/models/GameModel";

export const generateItems = (from: number, to: number): Game[] => {
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

export const initializeBoard = (items: Game[]): BoardColumns => {
  const columns: BoardColumns = {
    [BOARD_COLUMNS.Backlog]: [],
    [BOARD_COLUMNS.InProgress]: [],
    [BOARD_COLUMNS.Platinum]: [],
    [BOARD_COLUMNS.Complete]: [],
  };
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { status } = item;
    const column = columns[status];
    if (column === undefined) continue;
    columns[status].push(item);
  }
  const entries = Object.entries(columns);
  for (let i = 0; i < entries.length; i++) {
    const [key, items] = entries[i];
    columns[key] = [...items].sort((a, b) => a.position - b.position);
  }
  return columns;
};

export const moveBetweenContainers = (
  items: BoardColumns,
  activeContainer: BOARD_COLUMNS,
  activeIndex: number,
  overContainer: BOARD_COLUMNS,
  overIndex: number,
  itemId: UniqueIdentifier
): BoardColumns => {
  const item = items[activeContainer].find((item) => item.id === itemId);
  if (item === undefined) return items;
  const active = removeAtIndex(items[activeContainer], activeIndex);
  const over = insertAtIndex(items[overContainer], overIndex, {
    ...item,
    status: overContainer,
  });
  return { ...items, [activeContainer]: active, [overContainer]: over };
};

export const removeAtIndex = (array: Game[], index: number): Game[] => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (
  array: Game[],
  index: number,
  item: Game
): Game[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (
  array: Game[],
  oldIndex: number,
  newIndex: number
): Game[] => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};

const shouldHandleEvent = (element: HTMLElement | null): boolean => {
  let cur = element;
  while (cur != null) {
    if (cur.dataset?.noDnd != null) return false;
    cur = cur.parentElement;
  }
  return true;
};

export class PointerSensor extends LibPointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}
