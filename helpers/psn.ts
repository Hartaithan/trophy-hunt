interface IError {
  message: string;
}

export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Unexpected error"
): IError => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: defaultMessage };
};
