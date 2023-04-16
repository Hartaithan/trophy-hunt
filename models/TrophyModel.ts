import {
  type TitleTrophiesResponse,
  type AllCallOptions,
  type TitleTrophyGroupsResponse,
} from "psn-api";

export type TitleTrophiesOptions = Pick<
  AllCallOptions,
  "headerOverrides" | "limit" | "npServiceName" | "offset"
>;

export interface ITitleTrophies extends TitleTrophiesResponse {
  error?: Error;
}

export interface ITitleGroups extends TitleTrophyGroupsResponse {
  error?: Error;
}
