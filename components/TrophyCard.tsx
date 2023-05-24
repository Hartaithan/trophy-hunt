import { rarityLabels, trophyColors } from "@/constants/trophy";
import { type ITrophy } from "@/models/TrophyModel";
import { Flex, Text, Title, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";

interface ITrophyCardProps {
  trophy: ITrophy;
}

const useStyles = createStyles(
  ({ spacing }, { type, earnedRate }: ITrophy) => ({
    container: {
      padding: `${spacing.xs} ${spacing.md}`,
      alignItems: "center",
      background: `linear-gradient(110deg, transparent 0%, transparent ${
        earnedRate == null ? 87 : 75
      }%, ${trophyColors[type] + "66"} ${earnedRate == null ? 94 : 90}%, ${
        trophyColors[type] + "D9"
      } 100%)`,
      ":first-of-type": {
        paddingTop: spacing.md,
      },
      ":last-of-type": {
        paddingBottom: spacing.md,
      },
    },
    content: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1,
    },
    icon: {
      borderRadius: spacing.xs,
    },
  })
);

const TrophyCard: FC<ITrophyCardProps> = (props) => {
  const { trophy } = props;
  const { classes } = useStyles(trophy);

  const { name, detail, icon_url, type, rare, earnedRate } = trophy;

  return (
    <Flex className={classes.container} gap="lg">
      <Image
        width={80}
        height={80}
        className={classes.icon}
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
      {rare !== undefined && (
        <Flex direction="column" mr="md">
          <Title align="center" order={3}>
            {earnedRate}%
          </Title>
          <Text>{rarityLabels[rare]}</Text>
        </Flex>
      )}
      <Flex w={100} h={60} justify="center" align="center">
        <Image
          width={40}
          height={40}
          alt="trophy type icon"
          src={`/trophy/${type}.png`}
          unoptimized
        />
      </Flex>
    </Flex>
  );
};

export default TrophyCard;
