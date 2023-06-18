import { useGame } from "@/providers/GameProvider";
import {
  Button,
  Group,
  SegmentedControl,
  type SegmentedControlItem,
  createStyles,
} from "@mantine/core";
import { type FC } from "react";
import { CloudDownload } from "tabler-icons-react";

const earnedOptions: SegmentedControlItem[] = [
  { label: "All", value: "all" },
  { label: "Earned", value: "earned" },
  { label: "Unearned", value: "unearned" },
];

const typesOptions: SegmentedControlItem[] = [
  { label: "All", value: "all" },
  { label: "Platinum", value: "platinum" },
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
  { label: "Bronze", value: "bronze" },
];

const useStyles = createStyles(({ spacing }) => ({
  container: {
    width: "100%",
    gap: spacing.lg,
  },
}));

const TrophyPanel: FC = () => {
  const { classes } = useStyles();
  const { syncProgress } = useGame();

  return (
    <Group className={classes.container}>
      <SegmentedControl color="accent" radius="lg" data={earnedOptions} />
      <SegmentedControl color="accent" radius="lg" data={typesOptions} />
      <Button
        ml="auto"
        radius="lg"
        leftIcon={<CloudDownload size={20} />}
        onClick={() => syncProgress()}
      >
        Sync
      </Button>
    </Group>
  );
};

export default TrophyPanel;
