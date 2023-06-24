import { type FC } from "react";
import { Box, createStyles, Stack } from "@mantine/core";
import TrophyGroup from "./TrophyGroup";
import { useGame } from "@/providers/GameProvider";
import TrophyList from "./TrophyList";

const useStyles = createStyles(() => ({
  container: { width: "100%" },
}));

const TrophyGroups: FC = () => {
  const { trophies } = useGame();
  const { classes } = useStyles();

  if (trophies === null) return null;

  return (
    <Stack spacing="xl" className={classes.container}>
      {trophies.groups?.map((group) => (
        <Box key={group.id}>
          <TrophyGroup group={group} />
          <TrophyList trophies={group.trophies} />
        </Box>
      ))}
    </Stack>
  );
};

export default TrophyGroups;
