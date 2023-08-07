import { type NullablePSNProfile } from "@/models/AuthModel";

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

export const getPresence = (
  profile: NullablePSNProfile | undefined
): string | null => {
  if (profile == null) return null;
  if (profile.presences.length === 0) return null;
  if (profile.presences[0].onlineStatus === "online") return "Online";
  const date = new Date(profile.presences[0].lastOnlineDate);
  const formattedDate = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `Last online: ${formattedDate}, ${formattedTime}`;
};
