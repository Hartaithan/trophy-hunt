import { type MantineTheme } from "@mantine/core";

export type DefaultProps<P> =
  | Partial<P>
  | ((theme: MantineTheme) => Partial<P>);
