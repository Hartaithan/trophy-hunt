import { columnColors } from "@/constants/board";
import { calculateProgress } from "@/helpers/progress";
import { type IGame } from "@/models/GameModel";
import { type IProgressStats } from "@/models/ProgressModel";
import { Text, Group, Progress } from "@mantine/core";
import { useMemo, type FC } from "react";

interface IProgressStatsProps {
  progress: IGame["progress"];
}

const ProgressStats: FC<IProgressStatsProps> = (props) => {
  const { progress } = props;

  const stats: IProgressStats = useMemo(() => {
    return calculateProgress(progress);
  }, [progress]);

  return (
    <>
      <Group position="apart" mt="xs">
        <Text size={12}>Platinum Progress</Text>
        <Text size={12}>{stats.baseProgress}%</Text>
      </Group>
      <Progress
        value={stats.baseProgress}
        color={columnColors.platinum.color}
        mt={5}
      />
      <Group position="apart" mt="xs">
        <Text size={12}>Complete Progress</Text>
        <Text size={12}>{stats.totalProgress}%</Text>
      </Group>
      <Progress
        value={stats.totalProgress}
        color={columnColors.complete.color}
        mt={5}
      />
    </>
  );
};

export default ProgressStats;
