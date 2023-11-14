"use client";

import { useState, type FC } from "react";
import { type Trophy } from "@/models/TrophyModel";
import { Box, Stack } from "@mantine/core";
import { useGame } from "@/providers/GameProvider";
import { useElementSize } from "@mantine/hooks";
import classes from "./TrophyList.module.css";
import TrophyListEmpty from "../TrophyListEmpty/TrophyListEmpty";
import TrophyCard from "../TrophyCard/TrophyCard";

interface TrophyListProps {
  trophies: Trophy[];
}

const TrophyList: FC<TrophyListProps> = (props) => {
  const { trophies } = props;
  const { filters } = useGame();
  const { ref, height } = useElementSize();

  const [isLoaded, setLoaded] = useState(false);
  const isEmpty = isLoaded && height < 100;

  const handleLoad = (): void => {
    setLoaded(true);
  };

  return (
    <Box className={classes.container}>
      <TrophyListEmpty in={isEmpty} />
      <Stack ref={ref} mt="xl" gap="xs" onLoad={handleLoad}>
        {trophies.map((trophy) => {
          if (filters.type !== "all" && filters.type !== trophy.type)
            return null;
          return <TrophyCard key={trophy.id} trophy={trophy} />;
        })}
      </Stack>
    </Box>
  );
};

export default TrophyList;
