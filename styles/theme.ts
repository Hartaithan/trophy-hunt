import { type DefaultProps } from "@/models/ThemeModel";
import {
  type ContainerProps,
  type MantineThemeOverride,
  type ContextStylesParams,
  type CSSObject,
  type MantineTheme,
  type BadgeProps,
  type Styles,
  type MenuStylesNames,
  type SegmentedControlProps,
  type ModalProps,
} from "@mantine/core";
import { globalStyles } from "./global";
import { type NotificationProps } from "@mantine/notifications";
import { type RichTextEditorProps } from "@mantine/tiptap";

const ContainerDefaultProps: DefaultProps<ContainerProps> = ({ spacing }) => ({
  size: "xl",
  px: { base: spacing.xs, xl: 0 },
});

const ModalStyles: (
  theme: MantineTheme,
  params: unknown,
  context: ContextStylesParams
) => Record<string, CSSObject> = ({ radius, fontSizes }) => ({
  content: {
    borderRadius: radius.lg,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: 500,
  },
});

const BadgeStyles: BadgeProps["styles"] = ({ fontSizes }) => ({
  root: {
    padding: "2px 6px",
    fontSize: fontSizes.xs,
    fontWeight: 500,
    textTransform: "unset",
  },
  leftSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const NotificationStyles: NotificationProps["styles"] = ({ colors }) => ({
  root: { background: colors.primary[7] },
});

const NotificationDefaultProps: Partial<NotificationProps> = {
  radius: "md",
};

const MenuStyles: Styles<MenuStylesNames, object> = ({ colors, radius }) => ({
  dropdown: {
    background: colors.primary[7],
    borderRadius: radius.md,
  },
});

const SegmentedControlStyles: SegmentedControlProps["styles"] = () => ({
  control: {
    borderWidth: 0,
    ":not(:first-of-type)": {
      borderWidth: 0,
    },
  },
});

const ModalDefaultProps: Partial<ModalProps> = {
  zIndex: 10000,
  centered: true,
};

const RichTextEditorStyles: RichTextEditorProps["styles"] = {
  control: {
    ":disabled": {
      opacity: 0.5,
      pointerEvents: "none",
    },
  },
};

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
      defaultProps: ModalDefaultProps,
      styles: ModalStyles,
    },
    ModalRoot: {
      defaultProps: ModalDefaultProps,
    },
    Badge: {
      styles: BadgeStyles,
    },
    Notification: {
      defaultProps: NotificationDefaultProps,
      styles: NotificationStyles,
    },
    Menu: {
      styles: MenuStyles,
    },
    SegmentedControl: {
      styles: SegmentedControlStyles,
    },
    RichTextEditor: {
      styles: RichTextEditorStyles,
    },
  },
};

export default theme;
