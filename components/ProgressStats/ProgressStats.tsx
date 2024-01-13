"use client";

import { columnColors, columnsLabels } from "@/constants/board";
import { calculateProgress } from "@/utils/progress";
import { type Game } from "@/models/GameModel";
import { type ProgressStats as ProgressStatsType } from "@/models/ProgressModel";
import {
  Text,
  Group,
  Progress,
  useMantineTheme,
  Box,
  type BoxProps,
} from "@mantine/core";
import { useMemo, type FC, memo } from "react";
import { type Size } from "@/models/SizeModel";

interface ProgressStatsProps {
  width?: BoxProps["w"];
  size?: Size;
  progress: Game["progress"];
}

const { platinum, complete } = columnColors;

const ProgressStats: FC<ProgressStatsProps> = (props) => {
  const { width = "100%", size = "normal", progress } = props;
  const { colors } = useMantineTheme();

  const platinumColor = colors[platinum.color][platinum.shade];
  const completeColor = colors[complete.color][complete.shade];

  const stats: ProgressStatsType = useMemo(
    () => calculateProgress(progress),
    [progress],
  );

  return (
    <Box w={width}>
      <Group justify="space-between" mt="xs">
        <Text size={size === "normal" ? "xs" : "10px"}>
          {columnsLabels.platinum} Progress
        </Text>
        <Text size={size === "normal" ? "xs" : "10px"} fw={500}>
          {stats.baseProgress}%
        </Text>
      </Group>
      <Progress
        value={stats.baseProgress}
        color={platinumColor}
        radius="xs"
        size="sm"
        mt={5}
      />
      <Group justify="space-between" mt="xs">
        <Text size={size === "normal" ? "xs" : "10px"}>
          {columnsLabels.complete} Progress
        </Text>
        <Text size={size === "normal" ? "xs" : "10px"} fw={500}>
          {stats.totalProgress}%
        </Text>
      </Group>
      <Progress
        value={stats.totalProgress}
        color={completeColor}
        radius="xs"
        size="sm"
        mt={5}
      />
    </Box>
  );
};

export default memo(ProgressStats);
