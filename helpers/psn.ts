export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Unexpected error"
): string => {
  const input = error as { message: string | undefined };
  const hasMessage = Object.hasOwn(input, "message");
  if (hasMessage && input.message !== undefined) return input.message;
  return defaultMessage;
};
