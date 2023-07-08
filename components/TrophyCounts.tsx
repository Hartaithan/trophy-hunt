import { type TrophyCountItem } from "@/models/TrophyModel";
import {
  Flex,
  Group,
  type SpacingValue,
  type SystemProp,
  Text,
  useMantineTheme,
  Divider,
} from "@mantine/core";
import { type FC } from "react";
import TrophyIcon from "./TrophyIcon";
import { trophyColors } from "@/constants/trophy";
import { ListDetails } from "tabler-icons-react";

interface ITrophyCountsProps {
  counts: TrophyCountItem[];
  count?: number | null;
  size?: "normal" | "small";
  mt?: SystemProp<SpacingValue>;
}

const TrophyCounts: FC<ITrophyCountsProps> = (props) => {
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
              color={trophyColors[key]}
            >
              {value}
            </Text>
          </Flex>
        );
      })}
      {count != null && (
        <Flex align="center">
          <Divider orientation="vertical" size="sm" mr="md" />
          <ListDetails size={isSmall ? 20 : undefined} color={colors.dark[2]} />
          <Text
            ml={4}
            fw="bold"
            color="dark.2"
            size={isSmall ? "sm" : undefined}
          >
            {count}
          </Text>
        </Flex>
      )}
    </Group>
  );
};

export default TrophyCounts;
