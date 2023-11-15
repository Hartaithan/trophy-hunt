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
} from "@mantine/core";
import { extendedColors } from "./colors";
import { type CustomPosition } from "@/models/AppModel";

const ContainerDefaultProps: Partial<ContainerProps> = {
  size: "xl",
  px: { base: "xs", xl: 0 },
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
    Container: Container.extend({
      defaultProps: ContainerDefaultProps,
    }),
    Modal: Modal.extend({
      defaultProps: ModalDefaultProps,
    }),
    ModalRoot: ModalRoot.extend({
      defaultProps: ModalDefaultProps,
    }),
    Notification: Notification.extend({
      defaultProps: NotificationDefaultProps,
    }),
  },
});

export const mantineTheme = mergeMantineTheme(DEFAULT_THEME, theme);

export const centeredDialog: CustomPosition = {
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
};
