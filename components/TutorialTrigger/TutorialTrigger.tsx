import { Anchor, Group, InputLabel } from "@mantine/core";
import { type FC } from "react";

interface Props {
  open: () => void;
}

const TutorialTrigger: FC<Props> = (props) => {
  const { open } = props;
  return (
    <Group justify="space-between">
      <InputLabel required size="sm" fw={500}>
        NPSSO
      </InputLabel>
      <Anchor component="button" onClick={open} fw={500} fz="xs">
        What the fuck is NPSSO?
      </Anchor>
    </Group>
  );
};

export default TutorialTrigger;
