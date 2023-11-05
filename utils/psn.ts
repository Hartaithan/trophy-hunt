import { type MergedTrophies } from "@/models/TrophyModel";
import {
  type TitleTrophiesResponse,
  type UserTrophiesEarnedForTitleResponse,
} from "psn-api";

export const mergeTrophies = (
  trophies: TitleTrophiesResponse,
  earned: UserTrophiesEarnedForTitleResponse | null,
): MergedTrophies => {
  const { trophies: allTrophies, ...trophiesDetails } = trophies;
  const { trophies: earnedTrophies, ...earnedTrophiesDetails } = earned ?? {
    trophies: [],
  };
  const mergedTrophiesDetails = {
    ...trophiesDetails,
    ...earnedTrophiesDetails,
  };
  const mergedTrophies = allTrophies.map((i) => ({
    ...i,
    ...earnedTrophies.find((n) => n.trophyId === i.trophyId),
  }));
  return { ...mergedTrophiesDetails, trophies: mergedTrophies };
};
