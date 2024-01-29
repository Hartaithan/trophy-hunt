export const daysNouns = ["day", "days"];
export const hoursNouns = ["hour", "hours"];
export const minutesNouns = ["minute", "minutes"];
export const monthNouns = ["month", "months"];
export const yearNouns = ["year", "years"];
export const gameNouns = ["game", "games"];

export const getNoun = (val: number, strings: string[]): string => {
  return val + " " + strings[val === 1 ? 0 : 1];
};
