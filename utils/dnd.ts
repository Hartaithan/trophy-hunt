import { type MouseEvent } from "react";
import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";
import {
  PointerSensor as LibPointerSensor,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { type Game } from "@/models/GameModel";
import { type BOARD_COLUMNS, type BoardColumns } from "@/models/BoardModel";

export const moveBetweenContainers = (
  items: BoardColumns,
  activeContainer: BOARD_COLUMNS,
  activeIndex: number,
  overContainer: BOARD_COLUMNS,
  overIndex: number,
  itemId: UniqueIdentifier,
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
  item: Game,
): Game[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (
  array: Game[],
  oldIndex: number,
  newIndex: number,
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
