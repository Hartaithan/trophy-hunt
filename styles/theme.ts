import { type DefaultProps } from "@/models/ThemeModel";
import {
  type ContainerProps,
  type MantineThemeOverride,
  type ContextStylesParams,
  type CSSObject,
  type MantineTheme,
  type BadgeProps,
} from "@mantine/core";
import { globalStyles } from "./global";
import { type NotificationProps } from "@mantine/notifications";

const ContainerDefaultProps: DefaultProps<ContainerProps> = ({ spacing }) => ({
  size: "xl",
  px: { base: spacing.xs, xl: 0 },
});

const ModalStyles: (
  theme: MantineTheme,
  params: unknown,
  context: ContextStylesParams
) => Record<string, CSSObject> = ({ radius }) => ({
  content: {
    borderRadius: radius.lg,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
  },
});

const BadgeStyles: BadgeProps["styles"] = () => ({
  root: {
    padding: "2px 6px",
    fontSize: 12,
    fontWeight: 500,
    textTransform: "unset",
  },
});

const NotificationStyles: NotificationProps["styles"] = ({
  colors,
  radius,
}) => ({
  root: { background: colors.primary[7], borderRadius: radius.lg },
});

const extendedColors: MantineThemeOverride["colors"] = {
  primary: [
    "#717171",
    "#656565",
    "#595959",
    "#4D4D4D",
    "#414141",
    "#363636",
    "#2A2A2A",
    "#1E1E1E",
    "#121212",
    "#101010",
  ],
  secondary: [
    "#191919",
    "#323231",
    "#4B4A4A",
    "#646363",
    "#7D7C7C",
    "#AFAEAD",
    "#C8C6C6",
    "#E1DFDE",
    "#FAF8F7",
    "#FBF9F8",
  ],
  accent: [
    "#E6ECF5",
    "#CCD9EB",
    "#B3C7E1",
    "#99B4D7",
    "#80A1CE",
    "#4D7BBA",
    "#3369B0",
    "#1956A6",
    "#00439C",
    "#003C8C",
  ],
  accented: [
    "#000710",
    "#000D1F",
    "#00142F",
    "#001B3E",
    "#00224E",
    "#002F6D",
    "#00367D",
    "#003C8C",
    "#00439C",
    "#1956A6",
  ],
};

const theme: MantineThemeOverride = {
  colorScheme: "dark",
  primaryColor: "accent",
  colors: extendedColors,
  defaultGradient: { deg: 90, from: "accented.8", to: "accented.4" },
  globalStyles,
  components: {
    Container: {
      defaultProps: ContainerDefaultProps,
    },
    Modal: {
      styles: ModalStyles,
    },
    Badge: {
      styles: BadgeStyles,
    },
    Notification: {
      styles: NotificationStyles,
    },
  },
};

export default theme;
