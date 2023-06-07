import { rarityLabels, trophyColors } from "@/constants/trophy";
import { type ITrophy } from "@/models/TrophyModel";
import { useGame } from "@/providers/GameProvider";
import { Checkbox, Flex, Text, Title, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";

const IMAGE_SIZE = 80;

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
    wrapper: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      justifyContent: "center",
      alignItems: "center",
    },
    check: {
      opacity: 0,
      transition: "all 0.3s ease",
      position: "absolute",
    },
    checked: {
      filter: "grayscale(100%) opacity(50%)",
    },
  })
);

const TrophyCard: FC<ITrophyCardProps> = (props) => {
  const { trophy } = props;
  const { progress, toggleTrophy } = useGame();
  const { classes, cx } = useStyles(trophy);

  const { id, name, detail, icon_url, type, rare, earnedRate } = trophy;
  const checked = progress.find((i) => i.id === id)?.earned ?? false;

  return (
    <Flex
      className={cx(classes.container, checked && classes.checked, "trophy")}
      gap="lg"
    >
      <Flex className={classes.wrapper}>
        <Checkbox
          id="check"
          className={cx(classes.check, "check")}
          checked={checked}
          onChange={() => toggleTrophy(id)}
          size="xl"
        />
        <Image
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className={classes.icon}
          alt={name ?? "trophy icon url"}
          src={icon_url ?? ""}
          unoptimized
        />
      </Flex>
      <Flex className={classes.content}>
        {name != null && (
          <Text fw="bold" mb="xs" strikethrough={checked}>
            {name}
          </Text>
        )}
        {detail != null && <Text strikethrough={checked}>{detail}</Text>}
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
