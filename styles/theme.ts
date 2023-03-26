import { type DefaultProps } from "@/models/ThemeModel";
import { type ContainerProps, type MantineThemeOverride } from "@mantine/core";
import { globalStyles } from "./global";

const ContainerDefaultProps: DefaultProps<ContainerProps> = ({ spacing }) => ({
  size: "xl",
  px: { base: spacing.xs, xl: 0 },
});

const extendedColors: MantineThemeOverride["colors"] = {
  primary: [
    "#040405",
    "#070809",
    "#0B0C0E",
    "#0E1012",
    "#121417",
    "#191B20",
    "#1D1F25",
    "#202329",
    "#24272E",
    "#3A3D43",
  ],
  secondary: [
    "#191919",
    "#333333",
    "#4D4D4D",
    "#666666",
    "#808080",
    "#B3B3B3",
    "#CCCCCC",
    "#E6E6E6",
    "#FFFFFF",
    "#FFFFFF",
  ],
  accent: [
    "#180005",
    "#310109",
    "#49010E",
    "#610212",
    "#7A0217",
    "#AA0320",
    "#C20325",
    "#DB0429",
    "#F3042E",
    "#F41D43",
  ],
};

const theme: MantineThemeOverride = {
  colorScheme: "dark",
  primaryColor: "accent",
  colors: extendedColors,
  globalStyles,
  components: {
    Container: {
      defaultProps: ContainerDefaultProps,
    },
  },
};

export default theme;
