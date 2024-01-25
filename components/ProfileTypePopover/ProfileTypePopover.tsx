import { Text, Anchor, Group, InputLabel, Popover } from "@mantine/core";
import { type FC } from "react";

const ProfileTypePopover: FC = () => {
  return (
    <Group justify="space-between">
      <InputLabel required size="sm" fw={500}>
        Profile type
      </InputLabel>
      <Popover width={300} position="top-end" withArrow shadow="md">
        <Popover.Target>
          <Anchor component="button" fw={500} fz="xs">
            What&apos;s that?
          </Anchor>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs">
            A profile type is a setting that controls the visibility of your
            board. You can choose between public or private types. A public
            board can be viewed by anyone, while a private board is only visible
            to you.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};

export default ProfileTypePopover;
