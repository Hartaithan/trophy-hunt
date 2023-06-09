import {
  type TitleTrophiesResponse,
  type AllCallOptions,
  type TitleTrophyGroupsResponse,
  type UserTrophiesEarnedForTitleResponse,
  type UserTrophyGroupEarningsForTitleResponse,
  type TrophyGroupEarnings,
  type UserThinTrophy,
  type RarestThinTrophy,
} from "psn-api";

export type TitleTrophiesOptions = Pick<
  AllCallOptions,
  "headerOverrides" | "limit" | "npServiceName" | "offset"
>;

export interface IError {
  error: Error;
}

export type ITitleTrophies = TitleTrophiesResponse | IError;

export type ITitleGroups = TitleTrophyGroupsResponse | IError;

export type ITitleEarnedGroups =
  | UserTrophyGroupEarningsForTitleResponse
  | IError;

export type ITitleEarnedTrophies = UserTrophiesEarnedForTitleResponse | IError;

export type TrophyRare = 0 | 1 | 2 | 3;

export const TrophyRareLabels: Record<TrophyRare, string> = {
  0: "Ultra Rare",
  1: "Very Rare",
  2: "Rare",
  3: "Common",
};

export type TrophyType = "platinum" | "gold" | "silver" | "bronze";

export type TrophyTypeFilter = "all" | TrophyType;

export type TrophyEarnedFilter = "all" | "earned" | "unearned";

export type TrophyGroupId = "default" | string;

export interface ITrophy {
  id: number;
  hidden: boolean;
  type: TrophyType;
  name?: string;
  detail?: string;
  icon_url?: string;
  group_id?: TrophyGroupId;
  earned?: boolean;
  rare?: TrophyRare;
  earnedRate?: string;
  earnedDateTime?: string;
  progress_value?: string;
  progress_percentage?: number;
  progress_target?: string;
  progress_updated?: string;
}

export interface ITrophyCount {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export type TrophyCountItem = [string, number];

export interface IGroup {
  id: string;
  name: string;
  detail?: string;
  icon_url: string;
  count: number;
  counts: ITrophyCount;
  earned_counts?: ITrophyCount;
  trophies: ITrophy[];
}

export type GroupedTrophies = Record<TrophyGroupId, ITrophy[]>;

export interface IFormattedTrophies {
  grouped: GroupedTrophies;
  trophies: ITrophy[];
}

export interface IFormattedResponse {
  name: string;
  detail?: string;
  icon_url: string;
  platform: string;
  count: number;
  counts: ITrophyCount;
  earned_counts?: ITrophyCount;
  groups: IGroup[];
  trophies?: ITrophy[];
}

export type EarnedGroupsDetails = Omit<
  UserTrophyGroupEarningsForTitleResponse,
  "trophyGroups"
>;

export interface EarnedGroups extends Partial<EarnedGroupsDetails> {
  trophyGroups: Array<Partial<TrophyGroupEarnings>>;
}

export type MergedGroups = TitleTrophyGroupsResponse & EarnedGroups;

export type EarnedTrophiesDetails = Omit<
  UserTrophiesEarnedForTitleResponse,
  "trophies" | "lastUpdatedDateTime" | "rarestTrophies"
>;

export interface TrophyProgress {
  progress: string;
  progressRate: number;
  progressedDateTime: string;
}

export interface EarnedTrophies extends Partial<EarnedTrophiesDetails> {
  trophies: Array<Partial<UserThinTrophy> & Partial<TrophyProgress>>;
  rarestTrophies?: Array<Partial<RarestThinTrophy>>;
  lastUpdatedDateTime?: string | undefined;
}

export type MergedTrophies = TitleTrophiesResponse & EarnedTrophies;

export interface ITrophyFilters {
  type: TrophyTypeFilter;
  earned: TrophyEarnedFilter;
}
