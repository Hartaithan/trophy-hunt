"use client";

import { memo, type FC } from "react";
import {
  Flex,
  Popover,
  type FlexProps,
  Text,
  Button,
  Anchor,
} from "@mantine/core";
import { IconExclamationMark } from "@tabler/icons-react";
import classes from "./AuthTip.module.css";

const AuthTip: FC<FlexProps> = (props) => {
  return (
    <Flex className={classes.container} {...props}>
      <Popover
        classNames={{ dropdown: classes.dropdown }}
        width={400}
        position="top"
        shadow="md">
        <Popover.Target>
          <Button
            size="xs"
            color="orange"
            variant="light"
            className={classes.trigger}
            leftSection={<IconExclamationMark />}>
            Important Note!
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">
            To protect your account from unauthorized access, we recommend that
            you enable&nbsp;
            <Anchor
              href="https://www.playstation.com/en-us/playstation-network/two-step-verification/"
              target="_blank">
              2FA
            </Anchor>
            &nbsp;on your PSN account. This will provide you with an additional
            layer of security.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};

export default memo(AuthTip);
