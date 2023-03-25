import { type DefaultProps } from "@/models/ThemeModel";
import { type ContainerProps, type MantineThemeOverride } from "@mantine/core";

const ContainerDefaultProps: DefaultProps<ContainerProps> = ({ spacing }) => ({
  size: "xl",
  px: { base: spacing.xs, xl: 0 },
});

const extendedColors: MantineThemeOverride["colors"] = {
  primary: [
    "#FDFDFD",
    "#FBFBFB",
    "#F9F9F9",
    "#F6F6F5",
    "#F2F2F0",
    "#F0F0EE",
    "#EEEEEC",
    "#ECECEA",
    "#D4D4D3",
    "#BDBDBB",
  ],
  secondary: [
    "#EAEBEB",
    "#D5D6D7",
    "#BFC2C3",
    "#95999B",
    "#6B7072",
    "#555B5E",
    "#40474A",
    "#2B3236",
    "#272D31",
    "#22282B",
  ],
  accent: [
    "#E6ECF5",
    "#CCD9EB",
    "#B3C7E1",
    "#80A1CE",
    "#4D7BBA",
    "#3369B0",
    "#1956A6",
    "#00439C",
    "#003C8C",
    "#00367D",
  ],
};

const theme: MantineThemeOverride = {
  colors: extendedColors,
  components: {
    Container: {
      defaultProps: ContainerDefaultProps,
    },
  },
};

export default theme;
