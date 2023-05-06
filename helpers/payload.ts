type IPayloadObject = Record<string, unknown>;

interface IValidationResult {
  message: string;
  errors: string[];
}

export const validatePayload = (
  payload: IPayloadObject,
  ignore: string[] = []
): IValidationResult | null => {
  const results: string[] = [];
  const items = Object.entries(payload);
  if (items.length === 0) return { message: "Empty payload", errors: [] };
  for (let i = 0; i < items.length; i++) {
    const [key, value] = items[i];
    const allowedKey = ignore.includes(key);
    let check = value === undefined;
    if (typeof value === "string") {
      check = value.length === 0;
    }
    if (allowedKey) continue;
    if (check) {
      results.push(key + " is required");
    }
  }
  if (results.length === 0) return null;
  return { message: "Invalid payload", errors: results };
};
