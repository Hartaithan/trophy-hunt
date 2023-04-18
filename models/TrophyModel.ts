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

interface ITrophyCount {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

interface IGroup {
  id: string;
  name: string;
  detail: string;
  icon_url: string;
  counts: ITrophyCount;
}

export interface IGroupedTrophies {
  name: string;
  detail: string;
  icon_url: string;
  platform: string;
  groups: IGroup[];
  counts: ITrophyCount;
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

export interface EarnedTrophies extends Partial<EarnedTrophiesDetails> {
  trophies: Array<Partial<UserThinTrophy>>;
  rarestTrophies?: Array<Partial<RarestThinTrophy>>;
  lastUpdatedDateTime?: string | undefined;
}

export type MergedTrophies = TitleTrophiesResponse & EarnedTrophies;
