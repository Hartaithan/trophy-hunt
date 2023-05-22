import { type ITrophy } from "@/models/TrophyModel";
import { Flex, Text, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";

interface ITrophyCardProps {
  trophy: ITrophy;
}

const useStyles = createStyles(({ spacing }) => ({
  container: {
    alignItems: "center",
  },
  content: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: spacing.md,
    marginRight: spacing.md,
    flex: 1,
  },
}));

const TrophyCard: FC<ITrophyCardProps> = (props) => {
  const { trophy } = props;
  const { classes } = useStyles();

  const { name, detail, icon_url, type } = trophy;

  return (
    <Flex className={classes.container}>
      <Image
        width={80}
        height={80}
        alt={name ?? "trophy icon url"}
        src={icon_url ?? ""}
        unoptimized
      />
      <Flex className={classes.content}>
        {name != null && (
          <Text fw="bold" mb="xs">
            {name}
          </Text>
        )}
        {detail != null && <Text>{detail}</Text>}
      </Flex>
      <Image
        width={40}
        height={40}
        alt="trophy type icon"
        src={`/trophy/${type}.png`}
        unoptimized
      />
    </Flex>
  );
};

export default TrophyCard;
