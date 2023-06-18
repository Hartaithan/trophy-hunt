import {
  type TrophyEarnedFilter,
  type TrophyTypeFilter,
} from "@/models/TrophyModel";
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

interface IOptions<T> extends Omit<SegmentedControlItem, "value"> {
  value: T;
}

const earnedOptions: Array<IOptions<TrophyEarnedFilter>> = [
  { label: "All", value: "all" },
  { label: "Earned", value: "earned" },
  { label: "Unearned", value: "unearned" },
];

const typesOptions: Array<IOptions<TrophyTypeFilter>> = [
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
  const { syncProgress, filters, setFilters } = useGame();

  const handleEarnedChange = (value: TrophyEarnedFilter): void => {
    setFilters((prev) => ({ ...prev, earned: value }));
  };

  const handleTypeChange = (value: TrophyTypeFilter): void => {
    setFilters((prev) => ({ ...prev, type: value }));
  };

  return (
    <Group className={classes.container}>
      <SegmentedControl
        color="accent"
        radius="lg"
        data={earnedOptions}
        value={filters.earned}
        onChange={handleEarnedChange}
      />
      <SegmentedControl
        color="accent"
        radius="lg"
        data={typesOptions}
        value={filters.type}
        onChange={handleTypeChange}
      />
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
