import { type IFormattedResponse } from "@/models/TrophyModel";
import { type FC } from "react";
import TrophyCard from "./TrophyCard";
import { Box, createStyles, Stack } from "@mantine/core";
import TrophyGroup from "./TrophyGroup";

interface ITrophyListProps {
  trophies: IFormattedResponse | null;
}

const useStyles = createStyles(() => ({
  container: { width: "100%" },
}));

const TrophyList: FC<ITrophyListProps> = (props) => {
  const { trophies } = props;
  const { classes } = useStyles();

  if (trophies === null) return null;

  return (
    <Stack spacing="xl" className={classes.container}>
      {trophies.groups.map((group) => (
        <Box key={group.id}>
          <TrophyGroup group={group} />
          <Stack my="xl">
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
