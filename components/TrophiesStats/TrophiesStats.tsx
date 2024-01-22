"use client";

import { type NullablePSNProfile } from "@/models/AuthModel";
import { Flex, Progress, Text } from "@mantine/core";
import { useMemo, type FC } from "react";
import classes from "./TrophiesStats.module.css";
import { trophyColors } from "@/constants/trophy";
import TrophyIcon from "../TrophyIcon/TrophyIcon";
import { useMediaQuery } from "@mantine/hooks";
import { type Device } from "@/models/AppModel";

interface TrophiesStatsProps {
  psn: NullablePSNProfile;
}

const ICON_SIZE: Record<Device, number> = {
  desktop: 36,
  mobile: 24,
};

const TrophiesStats: FC<TrophiesStatsProps> = (props) => {
  const { psn } = props;
  const isMobile = useMediaQuery(`(max-width: 36em)`) ?? false;
  const device: Device = isMobile ? "mobile" : "desktop";

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
          <Text className={classes.label}>Level</Text>
          <Text className={classes.value}>{psn.trophySummary.level}</Text>
        </Flex>
        <Flex className={classes.block}>
          <Text className={classes.label}>Trophies</Text>
          <Text className={classes.value}>{total}</Text>
        </Flex>
        <Flex className={classes.progress}>
          <Flex className={classes.progressHeader}>
            <Text className={classes.label}>Progress</Text>
            <Text
              className={
                classes.progressValue
              }>{`${psn.trophySummary.progress}%`}</Text>
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
          <TrophyIcon
            width={ICON_SIZE[device]}
            height={ICON_SIZE[device]}
            type="platinum"
          />
          <Text className={classes.trophyValue} c={trophyColors.platinum}>
            {psn.trophySummary.earnedTrophies.platinum}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon
            width={ICON_SIZE[device]}
            height={ICON_SIZE[device]}
            type="gold"
          />
          <Text className={classes.trophyValue} c={trophyColors.gold}>
            {psn.trophySummary.earnedTrophies.gold}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon
            width={ICON_SIZE[device]}
            height={ICON_SIZE[device]}
            type="silver"
          />
          <Text className={classes.trophyValue} c={trophyColors.silver}>
            {psn.trophySummary.earnedTrophies.silver}
          </Text>
        </Flex>
        <Flex className={classes.blockRow}>
          <TrophyIcon
            width={ICON_SIZE[device]}
            height={ICON_SIZE[device]}
            type="bronze"
          />
          <Text className={classes.trophyValue} c={trophyColors.bronze}>
            {psn.trophySummary.earnedTrophies.bronze}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TrophiesStats;
