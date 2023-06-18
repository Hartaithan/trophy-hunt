import { type IGroup } from "@/models/TrophyModel";
import { Text, Flex, createStyles, Group, Badge } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";
import TrophyIcon from "./TrophyIcon";
import { trophyColors } from "@/constants/trophy";

interface ITrophyGroupProps {
  group: IGroup;
}

const useStyles = createStyles(({ spacing, radius, colors }) => ({
  container: {
    position: "sticky",
    top: spacing.md,
    width: "100%",
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  icon: {
    minHeight: 80,
    width: "auto",
    objectFit: "contain",
    borderRadius: radius.md,
  },
  info: {
    marginLeft: spacing.md,
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const TrophyGroup: FC<ITrophyGroupProps> = (props) => {
  const { group } = props;
  const { classes } = useStyles();

  const { id, icon_url, name, counts } = group;

  const countsArray = Object.entries(counts).reverse();

  return (
    <Flex className={classes.container}>
      <Image
        width={150}
        height={80}
        className={classes.icon}
        src={icon_url}
        alt={name ?? "group icon url"}
        unoptimized
      />
      <Flex className={classes.info}>
        <Flex align="center" mb="xs">
          <Text fw="bold">{name}</Text>
          <Badge ml="sm">{id === "default" ? "Base Game" : "DLC"}</Badge>
        </Flex>
        <Group>
          {countsArray.map(([key, value]) => {
            if (value === 0) return null;
            return (
              <Flex key={key}>
                <TrophyIcon type={key} />
                <Text ml={4} fw="bold" color={trophyColors[key]}>
                  {value}
                </Text>
              </Flex>
            );
          })}
        </Group>
      </Flex>
    </Flex>
  );
};

export default TrophyGroup;
