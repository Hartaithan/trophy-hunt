import {
  type TitleTrophiesResponse,
  type AllCallOptions,
  type TitleTrophyGroupsResponse,
  type UserTrophiesEarnedForTitleResponse,
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
