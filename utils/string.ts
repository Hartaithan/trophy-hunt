export const capitalize = (value: string): string => {
  return value[0].toUpperCase() + value.substring(1);
};

export const pad = (
  num: number,
  length: number,
  value: string = "0",
): string => {
  return String(num).padStart(length, value);
};
