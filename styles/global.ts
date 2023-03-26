import { type CSSObject, type MantineTheme } from "@mantine/core";

export const globalStyles = (theme: MantineTheme): CSSObject => ({
  "*": {
    color: theme.colors.secondary[8],
  },
  body: {
    ...theme.fn.fontStyles(),
    backgroundColor: theme.colors.primary[8],
  },
});
