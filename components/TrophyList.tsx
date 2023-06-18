import { type FC } from "react";
import TrophyCard from "./TrophyCard";
import { Box, createStyles, Stack } from "@mantine/core";
import TrophyGroup from "./TrophyGroup";
import { useGame } from "@/providers/GameProvider";

const useStyles = createStyles(() => ({
  container: { width: "100%" },
}));

const TrophyList: FC = () => {
  const { trophies } = useGame();
  const { classes } = useStyles();

  if (trophies === null) return null;

  return (
    <Stack spacing="xl" className={classes.container}>
      {trophies.groups?.map((group) => (
        <Box key={group.id}>
          <TrophyGroup group={group} />
          <Stack mt="xl" spacing="xs">
            {group.trophies.map((trophy) => (
              <TrophyCard key={trophy.id} trophy={trophy} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default TrophyList;
