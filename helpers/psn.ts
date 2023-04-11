export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Unexpected error"
): string => {
  const input = error as { message: string | undefined };
  if (Object.hasOwn(input, "message") && input.message !== undefined) {
    return input.message;
  }
  return defaultMessage;
};
