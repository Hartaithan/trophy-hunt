import { trophyColors } from "@/constants/trophy";
import { type NullablePSNProfile } from "@/models/AuthModel";
import { Flex, Progress, Text, createStyles } from "@mantine/core";
import { useMemo, type FC } from "react";
import TrophyIcon from "./TrophyIcon";

interface PSNTrophiesProps {
  profile: NullablePSNProfile | undefined;
}

const useStyles = createStyles(({ spacing, colors, radius }) => ({
  container: {
    width: "100%",
    gap: spacing.md,
  },
  content: {
    flex: 1,
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  block: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  blockRow: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  progress: {
    flexDirection: "column",
    gap: 4,
  },
  progressHeader: {
    justifyContent: "space-between",
  },
}));

const PSNTrophies: FC<PSNTrophiesProps> = (props) => {
  const { profile } = props;
  const { classes } = useStyles();

  const total = useMemo(() => {
    if (profile?.trophySummary == null) return null;
    const result = Object.values(profile.trophySummary.earnedTrophies).reduce(
      (i, acc) => acc + i,
      0
    );
    return result;
  }, [profile?.trophySummary]);

  if (profile?.trophySummary == null) return null;

  return (
    <Flex className={classes.container}>
      <Flex className={classes.content}>
        <Flex className={classes.block}>
          <Text fw={500}>Level</Text>
          <Text fz="xl" fw={700}>
            {profile.trophySummary.level}
          </Text>
        </Flex>
        <Flex className={classes.block}>
          <Text fw={500}>Trophies</Text>
          <Text fz="xl" fw={700}>
            {total}
          </Text>
        </Flex>
        <Flex className={classes.progress}>
          <Flex className={classes.progressHeader}>
            <Text fw={500}>Progress</Text>
            <Text fw={700}>{`${profile.trophySummary.progress}%`}</Text>
          </Flex>
          <Flex h={31} justify="center" align="center">
            <Progress
              w={200}
              value={profile.trophySummary.progress}
              size="xl"
              radius="xl"
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex className={classes.content}>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="platinum" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.platinum}>
            {profile.trophySummary.earnedTrophies.platinum}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="gold" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.gold}>
            {profile.trophySummary.earnedTrophies.gold}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="silver" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.silver}>
            {profile.trophySummary.earnedTrophies.silver}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="bronze" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.bronze}>
            {profile.trophySummary.earnedTrophies.bronze}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PSNTrophies;
