import { BOARD_COLUMNS, type IColumnColor } from "@/models/BoardModel";
import {
  type Platform,
  type IPlatformColor,
  type IPlatformLabel,
} from "@/models/PlatformModel";

export const columnColors: Record<BOARD_COLUMNS, IColumnColor> = {
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

export const platformColors: Record<Platform, IPlatformColor> = {
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

export const platformLabels: Record<Platform, IPlatformLabel> = {
  ps3: { short: "PS3", full: "Playstation 3" },
  ps4: { short: "PS4", full: "Playstation 4" },
  ps5: { short: "PS5", full: "Playstation 5" },
  vita: { short: "Vita", full: "Playstation Vita" },
};
