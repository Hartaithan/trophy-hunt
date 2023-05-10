import { columnColors, columnsLabels } from "@/constants/board";
import { calculateProgress } from "@/helpers/progress";
import { type IGame } from "@/models/GameModel";
import { type IProgressStats } from "@/models/ProgressModel";
import { Text, Group, Progress, useMantineTheme } from "@mantine/core";
import { useMemo, type FC, memo } from "react";

interface IProgressStatsProps {
  progress: IGame["progress"];
}

const { platinum, complete } = columnColors;

const ProgressStats: FC<IProgressStatsProps> = (props) => {
  const { progress } = props;
  const { colors } = useMantineTheme();

  const platinumColor = colors[platinum.color][platinum.shade];
  const completeColor = colors[complete.color][complete.shade];

  const stats: IProgressStats = useMemo(() => {
    return calculateProgress(progress);
  }, [progress]);

  return (
    <>
      <Group position="apart" mt="xs">
        <Text size={12}>{columnsLabels.platinum} Progress</Text>
        <Text size={12} fw={500}>
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
      <Group position="apart" mt="xs">
        <Text size={12}>{columnsLabels.complete} Progress</Text>
        <Text size={12} fw={500}>
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
    </>
  );
};

export default memo(ProgressStats);
