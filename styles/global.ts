import { type CSSObject, type MantineTheme } from "@mantine/core";

export const globalStyles = (theme: MantineTheme): CSSObject => ({
  "*": {
    color: theme.colors.secondary[8],
  },
  "::-webkit-scrollbar": {
    width: 6,
    background: theme.colors.primary[8],
  },
  "::-webkit-scrollbar-thumb": {
    borderRadius: 5,
    background: theme.colors.primary[5],
  },
  "::-webkit-scrollbar-thumb:hover": {
    background: theme.colors.primary[4],
  },
  body: {
    ...theme.fn.fontStyles(),
    backgroundColor: theme.colors.primary[8],
  },
});
