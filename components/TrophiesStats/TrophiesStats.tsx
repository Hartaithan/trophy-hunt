import { type NullablePSNProfile } from "@/models/AuthModel";
import { Flex, Progress, Text } from "@mantine/core";
import { useMemo, type FC } from "react";
import classes from "./TrophiesStats.module.css";
import { trophyColors } from "@/constants/trophy";
import TrophyIcon from "../TrophyIcon/TrophyIcon";

interface TrophiesStatsProps {
  psn: NullablePSNProfile;
}

const TrophiesStats: FC<TrophiesStatsProps> = (props) => {
  const { psn } = props;

  const total = useMemo(() => {
    if (psn?.trophySummary == null) return null;
    const result = Object.values(psn.trophySummary.earnedTrophies).reduce(
      (i, acc) => acc + i,
      0,
    );
    return result;
  }, [psn?.trophySummary]);

  if (psn?.trophySummary == null) return null;

  return (
    <Flex className={classes.container}>
      <Flex className={classes.content}>
        <Flex className={classes.block}>
          <Text fw={500}>Level</Text>
          <Text fz="xl" fw={700}>
            {psn.trophySummary.level}
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
            <Text fw={700}>{`${psn.trophySummary.progress}%`}</Text>
          </Flex>
          <Flex h={31} justify="center" align="center">
            <Progress
              w={200}
              value={psn.trophySummary.progress}
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
            {psn.trophySummary.earnedTrophies.platinum}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="gold" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.gold}>
            {psn.trophySummary.earnedTrophies.gold}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="silver" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.silver}>
            {psn.trophySummary.earnedTrophies.silver}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon width={36} height={36} type="bronze" />
          <Text fz={28} fw={700} ml={4} c={trophyColors.bronze}>
            {psn.trophySummary.earnedTrophies.bronze}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TrophiesStats;
