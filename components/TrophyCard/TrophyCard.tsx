"use client";

import { rarityLabels, trophyColors } from "@/constants/trophy";
import { type Trophy } from "@/models/TrophyModel";
import { useGame } from "@/providers/GameProvider";
import { Badge, Flex, Text, Title, useMantineTheme } from "@mantine/core";
import dayjs from "dayjs";
import { memo, type FC } from "react";
import { IconCheck } from "@tabler/icons-react";
import Image from "../Image/Image";
import classes from "./TrophyCard.module.css";
import clsx from "clsx";
import TrophyBadge from "../TrophyBadge/TrophyBadge";

const IMAGE_SIZE = 70;

interface TrophyCardProps {
  trophy: Trophy;
}

const TrophyCard: FC<TrophyCardProps> = (props) => {
  const { trophy } = props;
  const { progress, filters } = useGame();
  const { colors } = useMantineTheme();

  const {
    id,
    name,
    detail,
    icon_url,
    rare,
    type,
    earnedRate,
    earnedDateTime,
    progress_value,
    progress_target,
    progress_percentage,
  } = trophy;
  const checked = progress.find((i) => i.id === id)?.earned ?? false;

  const hasProgress =
    progress_value != null &&
    progress_target != null &&
    progress_percentage != null;

  if (filters.earned === "earned" && !checked) return null;
  if (filters.earned === "unearned" && checked) return null;

  return (
    <Flex
      className={clsx(classes.container, checked && classes.checked, "trophy")}>
      <TrophyBadge {...props} checked={checked} />
      <Flex
        className={classes.content}
        style={{
          background: `linear-gradient(110deg, transparent 0%, transparent 70%, ${trophyColors[type]}4D 80%, ${trophyColors[type]}99 95%, ${trophyColors[type]} 100%), ${colors.primary[7]}`,
        }}>
        <Image
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className={classes.icon}
          alt={name ?? "trophy icon url"}
          src={icon_url ?? ""}
        />
        <Flex className={classes.info}>
          {name != null && (
            <Flex mb="xs" align="center">
              <Text fw="bold" td={checked ? "line-through" : "unset"}>
                {name}
              </Text>
              {checked && earnedDateTime != null && (
                <Badge
                  ml="xs"
                  leftSection={<IconCheck size="0.75rem" />}
                  style={{
                    textDecoration: checked ? "line-through" : "none",
                  }}>
                  {dayjs(earnedDateTime).format("DD.MM.YYYY HH:mm")}
                </Badge>
              )}
            </Flex>
          )}
          {detail != null && (
            <Text td={checked ? "line-through" : "unset"}>{detail}</Text>
          )}
        </Flex>
        {hasProgress && (
          <Flex className={classes.rate}>
            <Title ta="center" order={3}>
              {progress_value} / {progress_target}
            </Title>
            <Text ta="center">Progress: {progress_percentage}%</Text>
          </Flex>
        )}
        {rare !== undefined && (
          <Flex className={classes.rate}>
            <Title ta="center" order={3}>
              {earnedRate}%
            </Title>
            <Text ta="center">{rarityLabels[rare]}</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default memo(TrophyCard);
