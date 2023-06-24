import { useState, type FC } from "react";
import { type ITrophy } from "@/models/TrophyModel";
import { Box, Collapse, Flex, Stack, Text, createStyles } from "@mantine/core";
import TrophyCard from "./TrophyCard";
import { useGame } from "@/providers/GameProvider";
import { useElementSize } from "@mantine/hooks";
import { MoodSad } from "tabler-icons-react";

interface ITrophyListProps {
  trophies: ITrophy[];
}

const useStyles = createStyles(({ colors, radius, spacing }) => ({
  container: { position: "relative" },
  collapsible: {
    position: "relative",
    top: spacing.xl,
  },
  empty: {
    height: 130,
    width: "100%",
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.sm,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const TrophyList: FC<ITrophyListProps> = (props) => {
  const { trophies } = props;
  const { filters } = useGame();
  const { classes } = useStyles();
  const { ref, height } = useElementSize();

  const [isLoaded, setLoaded] = useState(false);
  const isEmpty = isLoaded && height < 100;

  return (
    <Box className={classes.container}>
      <Collapse in={isEmpty} className={classes.collapsible}>
        <Flex className={classes.empty}>
          <MoodSad size={60} />
          <Text fw="bold" size="md" mt={4}>
            I couldn&apos;t find any trophies for the selected filters
          </Text>
        </Flex>
      </Collapse>
      <Stack ref={ref} mt="xl" spacing="xs" onLoad={() => setLoaded(true)}>
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
