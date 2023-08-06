import { useState, type FC } from "react";
import { type ITrophy } from "@/models/TrophyModel";
import { Box, Stack, createStyles } from "@mantine/core";
import TrophyCard from "./TrophyCard";
import { useGame } from "@/providers/GameProvider";
import { useElementSize } from "@mantine/hooks";
import TrophyListEmpty from "./TrophyListEmpty";

interface ITrophyListProps {
  trophies: ITrophy[];
}

const useStyles = createStyles(() => ({
  container: { position: "relative" },
}));

const TrophyList: FC<ITrophyListProps> = (props) => {
  const { trophies } = props;
  const { filters } = useGame();
  const { classes } = useStyles();
  const { ref, height } = useElementSize();

  const [isLoaded, setLoaded] = useState(false);
  const isEmpty = isLoaded && height < 100;

  const handleLoad = (): void => {
    setLoaded(true);
  };

  return (
    <Box className={classes.container}>
      <TrophyListEmpty in={isEmpty} />
      <Stack ref={ref} mt="xl" spacing="xs" onLoad={handleLoad}>
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
