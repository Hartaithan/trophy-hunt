import { BOARD_COLUMNS, type BoardColumns } from "@/models/BoardModel";
import { type Game } from "@/models/GameModel";

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
