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
    "#08080A",
    "#0C0C0F",
    "#101014",
    "#151519",
    "#1D1D22",
    "#212127",
    "#25252C",
    "#292931",
    "#3E3E46",
  ],
  secondary: [
    "#171717",
    "#2F2F2F",
    "#464646",
    "#5E5E5E",
    "#757575",
    "#A4A4A4",
    "#BBBBBB",
    "#D3D3D3",
    "#EAEAEA",
    "#ECECEC",
  ],
  accent: [
    "#190005",
    "#330009",
    "#4D000E",
    "#660012",
    "#800017",
    "#B30020",
    "#CC0025",
    "#E60029",
    "#FF002E",
    "#FF1943",
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
