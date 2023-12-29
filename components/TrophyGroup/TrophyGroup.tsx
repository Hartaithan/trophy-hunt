"use client";

import { type TrophyCountItem, type Group } from "@/models/TrophyModel";
import { Text, Flex, Badge, Checkbox, Title } from "@mantine/core";
import { useMemo, type FC, type ChangeEventHandler } from "react";
import TrophyCounts from "@/components/TrophyCounts/TrophyCounts";
import { useGame } from "@/providers/GameProvider";
import classes from "./TrophyGroup.module.css";
import Image from "../Image/Image";

interface TrophyGroupProps {
  group: Group;
}

interface Checked {
  count: number;
  earned: number;
  label: string;
  isAll: boolean;
  incomplete: boolean;
}

const emptyProgress: Checked = {
  count: 0,
  earned: 0,
  label: "",
  isAll: false,
  incomplete: false,
};

const TrophyGroup: FC<TrophyGroupProps> = (props) => {
  const { group } = props;
  const { progress, checkGroup } = useGame();

  const { id, icon_url, name, count, counts } = group;

  const countsArray: TrophyCountItem[] = Object.entries(counts).reverse();

  const checked = useMemo<Checked>(() => {
    if (progress.length === 0) return emptyProgress;
    let count = 0;
    let earned = 0;
    for (let i = 0; i < progress.length; i++) {
      const el = progress[i];
      const isMatch = el.group === id;
      const isEarned = el.earned;
      count = count + (isMatch ? 1 : 0);
      earned = earned + (isMatch && isEarned ? 1 : 0);
    }
    return {
      count,
      earned,
      label: `${earned} / ${count}`,
      isAll: count === earned,
      incomplete: count === earned ? false : earned !== 0,
    };
  }, [id, progress]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    checkGroup(id, !checked.isAll);
  };

  return (
    <Flex className={classes.container}>
      <Image
        width="0"
        height="0"
        className={classes.icon}
        src={icon_url}
        alt={name ?? "group icon url"}
      />
      <Flex className={classes.info}>
        <Flex className={classes.heading}>
          <Text fw="bold">{name}</Text>
          <Badge>{id === "default" ? "Base Game" : "DLC"}</Badge>
        </Flex>
        <TrophyCounts counts={countsArray} count={count} />
      </Flex>
      <Flex className={classes.count}>
        <Title
          order={4}
          mr="md"
          td={checked.isAll ? "line-through" : "unset"}
          c={checked.isAll ? "dimmed" : undefined}>
          {checked.label}
        </Title>
        <Checkbox
          checked={checked.isAll}
          indeterminate={checked.incomplete}
          onChange={handleChange}
          radius="md"
          size="lg"
          mr="md"
        />
      </Flex>
    </Flex>
  );
};

export default TrophyGroup;
