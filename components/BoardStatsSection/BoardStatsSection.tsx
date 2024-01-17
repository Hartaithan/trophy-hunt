"use client";

import { columnsFullLabels } from "@/constants/board";
import { type BoardStats, type BOARD_COLUMNS } from "@/models/BoardModel";
import { Flex, Grid, RingProgress, Text } from "@mantine/core";
import { type FC } from "react";
import classes from "./BoardStatsSection.module.css";

interface Props {
  stats: BoardStats | null;
}

const BoardStatsSection: FC<Props> = (props) => {
  const { stats } = props;

  if (stats === null) return null;

  return (
    <Flex className={classes.container}>
      <RingProgress
        size={150}
        sections={stats.sections}
        label={
          <Text className={classes.ringLabel}>{stats.backlogPercent}%</Text>
        }
      />
      <Grid className={classes.counts}>
        {Object.entries(stats.counts).map(([key, value]) => (
          <Grid.Col key={key} span={3}>
            <Flex className={classes.count}>
              <Text className={classes.countLabel}>
                {columnsFullLabels[key as BOARD_COLUMNS]}
              </Text>
              <Text key={key} className={classes.countValue}>
                {value}
              </Text>
            </Flex>
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
};

export default BoardStatsSection;
