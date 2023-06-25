import { type TrophyCountItem } from "@/models/TrophyModel";
import {
  Flex,
  Group,
  type SpacingValue,
  type SystemProp,
  Text,
} from "@mantine/core";
import { type FC } from "react";
import TrophyIcon from "./TrophyIcon";
import { trophyColors } from "@/constants/trophy";

interface ITrophyCountsProps {
  counts: TrophyCountItem[];
  size?: "normal" | "small";
  mt?: SystemProp<SpacingValue>;
}

const TrophyCounts: FC<ITrophyCountsProps> = (props) => {
  const { counts, size = "normal", mt } = props;
  const isSmall = size === "small";

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
              color={trophyColors[key]}
            >
              {value}
            </Text>
          </Flex>
        );
      })}
    </Group>
  );
};

export default TrophyCounts;
