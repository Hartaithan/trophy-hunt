import { type TrophyRare, type TrophyType } from "@/models/TrophyModel";

export const trophyColors: Record<TrophyType | string, string> = {
  platinum: "#667FB2",
  gold: "#C2903E",
  silver: "#777777",
  bronze: "#C46438",
};

export const rarityLabels: Record<TrophyRare, string> = {
  0: "Ultra Rare",
  1: "Very Rare",
  2: "Rare",
  3: "Common",
};
