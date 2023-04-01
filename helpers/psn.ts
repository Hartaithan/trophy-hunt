export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Unexpected error"
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
