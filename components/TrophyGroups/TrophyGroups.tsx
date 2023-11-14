"use client";

import { type FC } from "react";
import { Box, Stack } from "@mantine/core";
import { useGame } from "@/providers/GameProvider";
import TrophyGroup from "../TrophyGroup/TrophyGroup";
import classes from "./TrophyGroups.module.css";
import TrophyList from "../TrophyList/TrophyList";

const TrophyGroups: FC = () => {
  const { trophies } = useGame();

  if (trophies === null) return null;

  return (
    <Stack gap="xl" className={classes.container}>
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
