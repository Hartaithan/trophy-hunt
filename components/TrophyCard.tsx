import { type ITrophy } from "@/models/TrophyModel";
import { Flex, Text, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";

interface ITrophyCardProps {
  trophy: ITrophy;
}

const useStyles = createStyles(({ spacing }) => ({
  container: {},
  content: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
}));

const TrophyCard: FC<ITrophyCardProps> = (props) => {
  const { trophy } = props;
  const { classes } = useStyles();

  const { name, detail, icon_url } = trophy;

  return (
    <Flex className={classes.container}>
      <Image
        width={100}
        height={100}
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
    </Flex>
  );
};

export default TrophyCard;
