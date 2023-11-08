"use client";

import { createTheme } from "@mantine/core";
import { extendedColors } from "./colors";

export const theme = createTheme({
  defaultGradient: { deg: 90, from: "accented.8", to: "accented.4" },
  colors: extendedColors,
  primaryColor: "accent",
});
