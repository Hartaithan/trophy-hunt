import {
  type GroupedTrophies,
  type IFormattedResponse,
  type IFormattedTrophies,
  type IGroup,
  type ITrophy,
  type MergedGroups,
  type MergedTrophies,
} from "@/models/TrophyModel";
import {
  type TitleTrophyGroupsResponse,
  type TitleTrophiesResponse,
  type UserTrophiesEarnedForTitleResponse,
  type UserTrophyGroupEarningsForTitleResponse,
} from "psn-api";

export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Unexpected error"
): string => {
  const input = error as { message: string | undefined };
  const hasMessage = Object.hasOwn(input, "message");
  if (hasMessage && input.message !== undefined) return input.message;
  return defaultMessage;
};

export const mergeGroups = (
  groups: TitleTrophyGroupsResponse,
  earned: UserTrophyGroupEarningsForTitleResponse | null
): MergedGroups => {
  const empty = { trophyGroups: [] };
  const { trophyGroups: allGroups, ...groupDetails } = groups;
  const { trophyGroups: earnedGroups, ...earnedGroupDetails } = earned ?? empty;
  const mergedGroupDetails = {
    ...groupDetails,
    ...earnedGroupDetails,
  };
  const mergedGroups = allGroups.map((i) => ({
    ...i,
    ...earnedGroups.find((n) => n.trophyGroupId === i.trophyGroupId),
  }));
  return { ...mergedGroupDetails, trophyGroups: mergedGroups };
};

export const mergeTrophies = (
  trophies: TitleTrophiesResponse,
  earned: UserTrophiesEarnedForTitleResponse | null
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

export const formatTrophies = (
  trophies: TitleTrophiesResponse
): IFormattedTrophies => {
  const array = [...trophies.trophies];
  const formatted: ITrophy[] = [];
  const grouped: GroupedTrophies = {};
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    const trophy = {
      id: el.trophyId,
      hidden: el.trophyHidden,
      type: el.trophyType,
      name: el.trophyName,
      detail: el.trophyDetail,
      icon_url: el.trophyIconUrl,
      group_id: el.trophyGroupId,
    };
    formatted.push(trophy);
    if (el.trophyGroupId != null) {
      const list = grouped[el.trophyGroupId] ?? [];
      list.push(trophy);
      grouped[el.trophyGroupId] = list;
    }
  }
  return { grouped, trophies: formatted };
};

export const formatEarnedTrophies = (
  trophies: MergedTrophies
): IFormattedTrophies => {
  const array = [...trophies.trophies];
  const formatted: ITrophy[] = [];
  const grouped: GroupedTrophies = {};
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    const trophy: ITrophy = {
      id: el.trophyId,
      hidden: el.trophyHidden,
      type: el.trophyType,
      name: el.trophyName,
      detail: el.trophyDetail,
      icon_url: el.trophyIconUrl,
      group_id: el.trophyGroupId,
      earned: el.earned,
      rare: el.trophyRare,
      earnedRate: el.trophyEarnedRate,
      earnedDateTime: el.earnedDateTime,
    };
    formatted.push(trophy);
    if (el.trophyGroupId != null) {
      const list = grouped[el.trophyGroupId] ?? [];
      list.push(trophy);
      grouped[el.trophyGroupId] = list;
    }
  }
  return { grouped, trophies: formatted };
};

export const formatGroups = (
  groups: MergedGroups,
  trophies: GroupedTrophies,
  earned: boolean = false
): IGroup[] => {
  const array = [...groups.trophyGroups];
  const formatted: IGroup[] = [];
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    let group: IGroup = {
      id: el.trophyGroupId,
      name: el.trophyGroupName,
      detail: el.trophyGroupDetail,
      icon_url: el.trophyGroupIconUrl,
      count: trophies[el.trophyGroupId].length,
      counts: el.definedTrophies,
      trophies: trophies[el.trophyGroupId],
    };
    if (earned) {
      group = { ...group, earned_counts: el.earnedTrophies };
    }
    formatted.push(group);
  }
  return formatted;
};

export const formatResponse = (
  groups: TitleTrophyGroupsResponse,
  trophies: TitleTrophiesResponse,
  withTrophies: boolean = false
): IFormattedResponse => {
  const {
    trophyTitleName,
    trophyTitleDetail,
    trophyTitleIconUrl,
    trophyTitlePlatform,
    definedTrophies,
  } = groups;
  const { trophies: formattedTrophies, grouped } = formatTrophies(trophies);
  const formattedGroups = formatGroups(groups, grouped);
  let response: IFormattedResponse = {
    name: trophyTitleName,
    detail: trophyTitleDetail,
    icon_url: trophyTitleIconUrl,
    platform: trophyTitlePlatform,
    count: formattedTrophies.length,
    counts: definedTrophies,
    groups: formattedGroups,
  };
  if (withTrophies) {
    response = { ...response, trophies: formattedTrophies };
  }
  return response;
};

export const formatEarnedResponse = (
  groups: MergedGroups,
  trophies: MergedTrophies,
  withTrophies: boolean = false
): IFormattedResponse => {
  const {
    trophyTitleName,
    trophyTitleDetail,
    trophyTitleIconUrl,
    trophyTitlePlatform,
    definedTrophies,
    earnedTrophies,
  } = groups;
  const { trophies: formattedTrophies, grouped } =
    formatEarnedTrophies(trophies);
  const formattedGroups = formatGroups(groups, grouped, true);
  let response: IFormattedResponse = {
    name: trophyTitleName,
    detail: trophyTitleDetail,
    icon_url: trophyTitleIconUrl,
    platform: trophyTitlePlatform,
    count: formattedTrophies.length,
    counts: definedTrophies,
    earned_counts: earnedTrophies,
    groups: formattedGroups,
  };
  if (withTrophies) {
    response = { ...response, trophies: formattedTrophies };
  }
  return response;
};
