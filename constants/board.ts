import { BOARD_COLUMNS, type ColumnColor } from "@/models/BoardModel";
import {
  type Platform,
  type PlatformColor,
  type PlatformLabel,
} from "@/models/PlatformModel";

export const columnColors: Record<BOARD_COLUMNS, ColumnColor> = {
  [BOARD_COLUMNS.Backlog]: {
    color: "gray",
    shade: 6,
  },
  [BOARD_COLUMNS.InProgress]: {
    color: "green",
    shade: 9,
  },
  [BOARD_COLUMNS.Platinum]: {
    color: "blue",
    shade: 9,
  },
  [BOARD_COLUMNS.Complete]: {
    color: "red",
    shade: 9,
  },
};

export const columnsLabels: Record<BOARD_COLUMNS, string> = {
  [BOARD_COLUMNS.Backlog]: "Backlog",
  [BOARD_COLUMNS.InProgress]: "In Progress",
  [BOARD_COLUMNS.Platinum]: "Platinum",
  [BOARD_COLUMNS.Complete]: "100%",
};

export const columnsFullLabels: Record<BOARD_COLUMNS, string> = {
  [BOARD_COLUMNS.Backlog]: "Backlog",
  [BOARD_COLUMNS.InProgress]: "In Progress",
  [BOARD_COLUMNS.Platinum]: "Platinum",
  [BOARD_COLUMNS.Complete]: "Complete",
};

export const platformColors: Record<Platform, PlatformColor> = {
  ps3: {
    bg: "gray",
    fg: "white",
  },
  ps4: {
    bg: "gray",
    fg: "white",
  },
  ps5: {
    bg: "gray",
    fg: "white",
  },
  vita: {
    bg: "gray",
    fg: "white",
  },
};

export const platformLabels: Record<Platform, PlatformLabel> = {
  ps3: { short: "PS3", full: "Playstation 3" },
  ps4: { short: "PS4", full: "Playstation 4" },
  ps5: { short: "PS5", full: "Playstation 5" },
  vita: { short: "Vita", full: "Playstation Vita" },
};
