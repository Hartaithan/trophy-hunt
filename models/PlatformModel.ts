export type Platform = "ps3" | "ps4" | "ps5" | "vita" | string;

export interface IPlatformLabel {
  short: string;
  full: string;
}

export interface IPlatformColor {
  bg: string;
  fg: string;
}
