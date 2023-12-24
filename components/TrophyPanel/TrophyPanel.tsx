"use client";

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
} from "@mantine/core";
import { type FC } from "react";
import {
  IconCloudDownload,
  IconListCheck,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./TrophyPanel.module.css";

interface Options<T> extends Omit<SegmentedControlItem, "value"> {
  value: T;
}

const earnedOptions: Array<Options<TrophyEarnedFilter>> = [
  { label: "All", value: "all" },
  { label: "Earned", value: "earned" },
  { label: "Unearned", value: "unearned" },
];

const typesOptions: Array<Options<TrophyTypeFilter>> = [
  { label: "All", value: "all" },
  { label: "Platinum", value: "platinum" },
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
  { label: "Bronze", value: "bronze" },
];

const TrophyPanel: FC = () => {
  const { game, filters, isAllChecked, syncProgress, setFilters, checkAll } =
    useGame();

  const handleEarnedChange = (value: string): void => {
    const earned = value as TrophyEarnedFilter;
    setFilters((prev) => ({ ...prev, earned }));
  };

  const handleTypeChange = (value: string): void => {
    const type = value as TrophyTypeFilter;
    setFilters((prev) => ({ ...prev, type }));
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
      <Group className={classes.filters}>
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
      </Group>
      <Group className={classes.options}>
        <Button
          radius="lg"
          leftSection={<IconListCheck size={20} />}
          onClick={handleCheckAll}>
          {isAllChecked ? "Uncheck" : "Check"} all
        </Button>
        <Button
          radius="lg"
          leftSection={<IconSearch size={20} />}
          onClick={handleGoogleSearch}>
          Find in Google
        </Button>
        <Button
          radius="lg"
          leftSection={<IconCloudDownload size={20} />}
          onClick={syncProgress}>
          Sync
        </Button>
      </Group>
    </Group>
  );
};

export default TrophyPanel;
