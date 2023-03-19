import { type DefaultProps } from "@/models/ThemeModel";
import { type ContainerProps, type MantineThemeOverride } from "@mantine/core";

const ContainerDefaultProps: DefaultProps<ContainerProps> = ({ spacing }) => ({
  size: "xl",
  px: { base: spacing.xs, xl: 0 },
});

const theme: MantineThemeOverride = {
  components: {
    Container: {
      defaultProps: ContainerDefaultProps,
    },
  },
};

export default theme;
