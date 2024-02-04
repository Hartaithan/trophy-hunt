export interface RegionItem {
  id: number;
  title: string;
  platform_title: string;
}

export interface RegionsResult extends Omit<RegionItem, "platform_title"> {
  platform: string;
}

export interface RegionsResponse {
  results: RegionsResult[];
}
