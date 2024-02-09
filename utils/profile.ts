import { type NullablePSNProfile, type Presence } from "@/models/AuthModel";
import dayjs from "dayjs";

export const getName = (profile: NullablePSNProfile | undefined): string => {
  if (profile == null) return "Name Not Found";
  let result = "";
  if (profile.personalDetail.firstName != null) {
    result = result + profile.personalDetail.firstName + " ";
  }
  if (profile.personalDetail.middleName != null) {
    result = result + profile.personalDetail.middleName + " ";
  }
  if (profile.personalDetail.lastName != null) {
    result = result + profile.personalDetail.lastName;
  }
  return result;
};

export const getLastOnlineDate = (presence: Presence): string | null => {
  if (presence.lastOnlineDate == null) return null;
  const value = dayjs(presence.lastOnlineDate);
  const date = value.format("DD.MM.YYYY");
  const time = value.format("HH:mm:ss");
  return `Last online: ${date}, ${time}`;
};

export const getPresence = (
  profile: NullablePSNProfile | undefined,
): string | null => {
  if (profile == null) return null;
  if (profile.presences.length === 0) return null;
  const presence = profile.presences[0];
  if (presence.onlineStatus === "online") return "Online";
  const lastOnlineDate = getLastOnlineDate(presence);
  if (lastOnlineDate != null) return "Offline | " + lastOnlineDate;
  return "Offline";
};
