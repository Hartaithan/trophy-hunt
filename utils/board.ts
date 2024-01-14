import {
  BOARD_COLUMNS,
  type BoardStats,
  type BoardColumns,
  type BoardCounts,
} from "@/models/BoardModel";
import { type Game } from "@/models/GameModel";

export const initializeBoard = (
  items: Game[] | null,
  skipSorting = false,
): BoardColumns => {
  const columns: BoardColumns = {
    [BOARD_COLUMNS.Backlog]: [],
    [BOARD_COLUMNS.InProgress]: [],
    [BOARD_COLUMNS.Platinum]: [],
    [BOARD_COLUMNS.Complete]: [],
  };
  if (items == null) return columns;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { status } = item;
    const column = columns[status];
    if (column === undefined) continue;
    columns[status].push(item);
  }
  if (skipSorting) return columns;
  const entries = Object.entries(columns);
  for (let i = 0; i < entries.length; i++) {
    const [key, items] = entries[i];
    columns[key] = [...items].sort((a, b) => {
      const c = a.position != null ? a.position.value : 0;
      const d = b.position != null ? b.position.value : 0;
      return c - d;
    });
  }
  return columns;
};

export const initializeBoardStats = (
  items: Game[] | null,
): BoardStats | null => {
  const columns: BoardColumns = {
    [BOARD_COLUMNS.Backlog]: [],
    [BOARD_COLUMNS.InProgress]: [],
    [BOARD_COLUMNS.Platinum]: [],
    [BOARD_COLUMNS.Complete]: [],
  };
  if (items == null) return null;
  let complete = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { status } = item;
    const column = columns[status];
    const isComplete =
      status === BOARD_COLUMNS.Complete || status === BOARD_COLUMNS.Platinum;
    if (isComplete) complete += 1;
    if (column === undefined) continue;
    columns[status].push(item);
  }
  const counts = Object.entries(columns).reduce<BoardCounts>(
    (acc, [key, value]) => {
      acc[key] = value.length;
      return acc;
    },
    {},
  );
  const backlogPercent = (complete * 100) / items.length;
  return { counts, backlogPercent: parseFloat(backlogPercent.toFixed(1)) };
};
