"use client";

import { type Trophy } from "@/models/TrophyModel";
import { useGame } from "@/providers/GameProvider";
import { Checkbox, Flex } from "@mantine/core";
import Image from "next/image";
import { memo, type FC, type ChangeEventHandler } from "react";
import classes from "./TrophyBadge.module.css";

interface TrophyBadgeProps {
  trophy: Trophy;
  checked: boolean;
}

const TrophyBadge: FC<TrophyBadgeProps> = (props) => {
  const { trophy, checked } = props;
  const { toggleTrophy } = useGame();

  const { id, type } = trophy;

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    toggleTrophy(id);
  };

  return (
    <Flex className={classes.badge}>
      <Image
        width={30}
        height={30}
        alt="trophy type icon"
        src={`/trophy/${type}.png`}
        unoptimized
      />
      <Checkbox checked={checked} onChange={handleChange} size="md" />
    </Flex>
  );
};

export default memo(TrophyBadge);
