import { type IGroup } from "@/models/TrophyModel";
import { Text, Flex, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";

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

  return (
    <Flex className={classes.container}>
      <Image
        width={150}
        height={100}
        className={classes.icon}
        src={icon_url}
        alt={name ?? "group icon url"}
      />
      <Flex className={classes.info}>
        <Text fw="bold">{name}</Text>
        <Text>
          {counts.platinum > 0 && (
            <Text span inherit>
              {`Platinum: ${counts.platinum}, `}
            </Text>
          )}
          {counts.gold > 0 && (
            <Text span inherit>
              {`Gold: ${counts.gold}, `}
            </Text>
          )}
          {counts.silver > 0 && (
            <Text span inherit>
              {`Silver: ${counts.silver}, `}
            </Text>
          )}
          {counts.bronze > 0 && (
            <Text span inherit>
              {`Bronze: ${counts.bronze}`}
            </Text>
          )}
        </Text>
      </Flex>
    </Flex>
  );
};

export default TrophyGroup;
