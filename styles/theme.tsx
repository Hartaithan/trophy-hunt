"use client";

import {
  Container,
  type ContainerProps,
  Modal,
  ModalRoot,
  createTheme,
  type ModalProps,
  type NotificationProps,
  Notification,
  mergeMantineTheme,
  DEFAULT_THEME,
  Badge,
  Menu,
  SegmentedControl,
  ScrollArea,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { extendedColors } from "./colors";
import BadgeClasses from "./Badge.module.css";
import ModalClasses from "./Modal.module.css";
import NotificationClasses from "./Notification.module.css";
import MenuClasses from "./Menu.module.css";
import SegmentedControlClasses from "./SegmentedControl.module.css";
import RichTextEditorClasses from "./RichTextEditor.module.css";
import ScrollAreaClasses from "./ScrollArea.module.css";

const ContainerDefaultProps: Partial<ContainerProps> = {
  size: "xl",
  px: { base: "md", xl: 0 },
};

const ModalDefaultProps: Partial<ModalProps> = {
  centered: true,
};

const NotificationDefaultProps: Partial<NotificationProps> = {
  radius: "md",
};

export const theme = createTheme({
  defaultGradient: { deg: 90, from: "accented.8", to: "accented.4" },
  colors: extendedColors,
  primaryColor: "accent",
  components: {
    Badge: Badge.extend({
      classNames: BadgeClasses,
    }),
    Container: Container.extend({
      defaultProps: ContainerDefaultProps,
    }),
    Modal: Modal.extend({
      defaultProps: ModalDefaultProps,
      classNames: ModalClasses,
    }),
    ModalRoot: ModalRoot.extend({
      defaultProps: ModalDefaultProps,
    }),
    Notification: Notification.extend({
      defaultProps: NotificationDefaultProps,
      classNames: NotificationClasses,
    }),
    Menu: Menu.extend({
      classNames: MenuClasses,
    }),
    SegmentedControl: SegmentedControl.extend({
      classNames: SegmentedControlClasses,
    }),
    RichTextEditor: RichTextEditor.extend({
      classNames: RichTextEditorClasses,
    }),
    ScrollArea: ScrollArea.extend({
      classNames: ScrollAreaClasses,
    }),
  },
});

export const mantineTheme = mergeMantineTheme(DEFAULT_THEME, theme);
