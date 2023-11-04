export type PayloadItem = [string, unknown];
export type PayloadObject = Record<string, unknown>;

interface ValidationResult {
  message: string;
  errors: string[];
}

interface RequiredResult {
  hasAllFields: boolean;
  errors: string[];
}

interface EmptyResult {
  results: string[];
}

export const checkRequiredFields = (
  items: PayloadItem[],
  fields: string[],
): RequiredResult => {
  const results: string[] = [];
  let hasAllFields = true;
  for (let n = 0; n < fields.length; n++) {
    const key = fields[n];
    const keyIsPassed = items.some((i) => i[0] === key);
    if (keyIsPassed) continue;
    results.push(key + " is required");
    hasAllFields = false;
  }
  return { hasAllFields, errors: results };
};

const checkEmptyFields = (
  items: PayloadItem[],
  ignore: string[],
): EmptyResult => {
  const results: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const [key, value] = items[i];
    const allowedKey = ignore.includes(key);
    let check = value === undefined;
    if (typeof value === "string") {
      check = value.length === 0;
    }
    if (allowedKey) continue;
    if (check) {
      results.push(key + " is empty");
    }
  }
  return { results };
};

export const validatePayload = (
  payload: PayloadObject,
  required: string[] | null = null,
  ignore: string[] = [],
): ValidationResult | null => {
  const items = Object.entries(payload);
  if (required != null) {
    const { hasAllFields, errors } = checkRequiredFields(items, required);
    if (!hasAllFields) {
      return { message: "Invalid payload", errors };
    }
  }
  if (items.length === 0) return { message: "Empty payload", errors: [] };
  const { results } = checkEmptyFields(items, ignore);
  if (results.length === 0) return null;
  return { message: "Invalid payload", errors: results };
};
