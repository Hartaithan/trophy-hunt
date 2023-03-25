import { type Tuple, type DefaultMantineColor } from "@mantine/core";

type ExtendedColors = "primary" | "secondary" | "accent" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedColors, Tuple<string, 10>>;
  }
}
