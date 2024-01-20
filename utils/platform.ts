import { type Platform } from "@/models/PlatformModel";

export const formatPlatform = (value: string): Platform => {
  if (value === "PSVITA") return "vita";
  return value.toLowerCase();
};
