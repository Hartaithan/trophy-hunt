"use client";

import { columnsFullLabels } from "@/constants/board";
import { type BoardStats, type BOARD_COLUMNS } from "@/models/BoardModel";
import { Box, Flex, Grid, RingProgress, Text, Title } from "@mantine/core";
import { type FC } from "react";
import classes from "./BoardStatsSection.module.css";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  stats: BoardStats | null;
}

const BoardStatsSection: FC<Props> = (props) => {
  const { stats } = props;
  const isMobile = useMediaQuery(`(max-width: 62em)`) ?? false;

  if (stats === null) return null;

  return (
    <Box className={classes.container}>
      <Title className={classes.title}>Board statistics</Title>
      <Flex className={classes.content}>
        <RingProgress
          size={isMobile ? 200 : 250}
          thickness={isMobile ? 18 : 25}
          sections={stats.sections}
          label={
            <Flex direction="column">
              <Text className={classes.label}>{stats.backlogPercent}%</Text>
              <Text className={classes.description}>
                {`Backlog\ncompletion`}
              </Text>
            </Flex>
          }
        />
        <Grid className={classes.counts}>
          {Object.entries(stats.counts).map(([key, value]) => (
            <Grid.Col key={key} span={{ base: 6 }}>
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
    </Box>
  );
};

export default BoardStatsSection;
