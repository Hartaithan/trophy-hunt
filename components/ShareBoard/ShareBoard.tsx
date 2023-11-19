"use client";

import { type NullableProfile } from "@/models/AuthModel";
import { type FC } from "react";
import classes from "./ShareBoard.module.css";
import {
  ActionIcon,
  CopyButton,
  Flex,
  Input,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

const BASE_URL = "https://trophy-hunt.vercel.app/board";

interface Props {
  profile: NullableProfile;
}

const ShareBoard: FC<Props> = (props) => {
  const { profile } = props;

  if (profile == null) return null;
  if (profile.type !== "public") return null;

  const url = BASE_URL + "/" + profile.username;

  return (
    <Flex className={classes.container}>
      <Text fz="xl" fw={700}>
        Your board is public! You can share it with your friends!
      </Text>
      <Input
        classNames={{
          input: classes.input,
          section: classes.section,
        }}
        value={url}
        readOnly
        radius="md"
        rightSection={
          <CopyButton value={url} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right">
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}>
                  {copied ? <IconCheck /> : <IconCopy />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        }
      />
    </Flex>
  );
};

export default ShareBoard;
