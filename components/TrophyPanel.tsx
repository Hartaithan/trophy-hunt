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
import {
  IconCloudDownload,
  IconListCheck,
  IconSearch,
} from "@tabler/icons-react";

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
  const { game, filters, isAllChecked, syncProgress, setFilters, checkAll } =
    useGame();

  const handleEarnedChange = (value: TrophyEarnedFilter): void => {
    setFilters((prev) => ({ ...prev, earned: value }));
  };

  const handleTypeChange = (value: TrophyTypeFilter): void => {
    setFilters((prev) => ({ ...prev, type: value }));
  };

  const handleGoogleSearch = (): void => {
    if (typeof window === "undefined") return;
    if (game == null) return;
    const query = `${game.title.toLowerCase()} trophies`;
    const url = "https://google.com/search?q=";
    window.open(url + query, "_blank");
  };

  const handleCheckAll = (): void => {
    checkAll(!isAllChecked);
  };

  return (
    <Group className={classes.container}>
      <SegmentedControl
        color="accent"
        radius="lg"
        data={earnedOptions}
        defaultValue="all"
        value={filters.earned}
        onChange={handleEarnedChange}
      />
      <SegmentedControl
        color="accent"
        radius="lg"
        data={typesOptions}
        defaultValue="all"
        value={filters.type}
        onChange={handleTypeChange}
      />
      <Button
        ml="auto"
        radius="lg"
        leftIcon={<IconListCheck size={20} />}
        onClick={handleCheckAll}
      >
        {isAllChecked ? "Uncheck" : "Check"} all
      </Button>
      <Button
        radius="lg"
        leftIcon={<IconSearch size={20} />}
        onClick={handleGoogleSearch}
      >
        Find in Google
      </Button>
      <Button
        radius="lg"
        leftIcon={<IconCloudDownload size={20} />}
        onClick={syncProgress}
      >
        Sync
      </Button>
    </Group>
  );
};

export default TrophyPanel;
