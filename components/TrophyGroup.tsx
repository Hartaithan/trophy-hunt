import { type IGroup } from "@/models/TrophyModel";
import { Text, Flex, createStyles, Group } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";
import TrophyIcon from "./TrophyIcon";
import { trophyColors } from "@/constants/trophy";

interface ITrophyGroupProps {
  group: IGroup;
}

const useStyles = createStyles(({ spacing }) => ({
  container: {
    width: "100%",
    marginBottom: spacing.md,
  },
  icon: { height: "auto", objectFit: "contain" },
  info: {
    marginLeft: spacing.md,
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const TrophyGroup: FC<ITrophyGroupProps> = (props) => {
  const { group } = props;
  const { classes } = useStyles();

  const { icon_url, name, counts } = group;

  const countsArray = Object.entries(counts).reverse();

  return (
    <Flex className={classes.container}>
      <Image
        width={150}
        height={100}
        className={classes.icon}
        src={icon_url}
        alt={name ?? "group icon url"}
        unoptimized
      />
      <Flex className={classes.info}>
        <Text fw="bold" mb={4}>
          {name}
        </Text>
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
