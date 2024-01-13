"use client";

import { type TrophyCountItem } from "@/models/TrophyModel";
import {
  Flex,
  Group,
  Text,
  useMantineTheme,
  Divider,
  type MantineSpacing,
} from "@mantine/core";
import { type FC } from "react";
import { trophyColors } from "@/constants/trophy";
import { IconListDetails } from "@tabler/icons-react";
import TrophyIcon from "../TrophyIcon/TrophyIcon";
import { type Size } from "@/models/SizeModel";

interface TrophyCountsProps {
  counts: TrophyCountItem[];
  count?: number | null;
  size?: Size;
  mt?: MantineSpacing;
}

const TrophyCounts: FC<TrophyCountsProps> = (props) => {
  const { counts, count, size = "normal", mt } = props;
  const isSmall = size === "small";
  const { colors } = useMantineTheme();

  if (counts.length === 0) return null;

  return (
    <Group mt={mt}>
      {counts.map(([key, value]) => {
        if (value === 0) return null;
        return (
          <Flex key={key} align="center">
            <TrophyIcon type={key} size={isSmall ? 20 : undefined} />
            <Text
              ml={4}
              fw="bold"
              size={isSmall ? "sm" : undefined}
              c={trophyColors[key]}>
              {value}
            </Text>
          </Flex>
        );
      })}
      {count != null && (
        <Flex align="center">
          <Divider orientation="vertical" size="sm" mr="md" />
          <IconListDetails
            size={isSmall ? 20 : undefined}
            color={colors.dark[2]}
          />
          <Text ml={4} fw="bold" c="dark.2" size={isSmall ? "sm" : undefined}>
            {count}
          </Text>
        </Flex>
      )}
    </Group>
  );
};

export default TrophyCounts;
