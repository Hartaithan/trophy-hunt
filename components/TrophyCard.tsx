import {
  rarityLabels,
  trophyColors,
  trophyColorsAccented,
} from "@/constants/trophy";
import { type ITrophy } from "@/models/TrophyModel";
import { useGame } from "@/providers/GameProvider";
import {
  Badge,
  Flex,
  Text,
  Title,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import dayjs from "dayjs";
import { memo, type FC } from "react";
import { IconCheck, IconNotes } from "@tabler/icons-react";
import Image from "next/image";
import TrophyBadge from "./TrophyBadge";

const IMAGE_SIZE = 70;

interface ITrophyCardProps {
  trophy: ITrophy;
}

const useStyles = createStyles(
  ({ colors, spacing, radius }, { type }: ITrophy) => ({
    container: {
      minHeight: 100,
      gap: spacing.xs,
    },
    checked: {
      filter: "grayscale(100%) opacity(50%)",
    },
    icon: {
      borderRadius: spacing.xs,
    },
    badge: {
      width: 60,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xs,
      background: colors.primary[7],
      borderRadius: radius.lg,
      padding: spacing.sm,
    },
    content: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.primary[7],
      borderRadius: radius.lg,
      gap: spacing.sm,
      padding: spacing.sm,
      background: `linear-gradient(110deg, transparent 0%, transparent 70%, ${trophyColors[type]}4D 80%, ${trophyColors[type]}99 95%, ${trophyColors[type]} 100%), ${colors.primary[7]}`,
    },
    info: {
      flex: 1,
      flexDirection: "column",
    },
    rate: {
      flexDirection: "column",
      marginRight: spacing.md,
      "& > *": {
        textShadow: "2px 2px 5px black",
      },
    },
    note: {
      width: 50,
      height: 50,
      display: "flex",
      padding: spacing.sm,
      backgroundColor: trophyColorsAccented[type] + "E3",
      borderRadius: 10,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
      "& > svg": {
        stroke: trophyColors[type],
      },
    },
  })
);

const TrophyCard: FC<ITrophyCardProps> = (props) => {
  const { trophy } = props;
  const { game, progress, filters, noteModal } = useGame();
  const { classes, cx } = useStyles(trophy);
  const { open } = noteModal;

  const {
    id,
    name,
    detail,
    icon_url,
    rare,
    earnedRate,
    earnedDateTime,
    progress_value,
    progress_target,
    progress_percentage,
  } = trophy;
  const checked = progress.find((i) => i.id === id)?.earned ?? false;

  const hasProgress =
    progress_value != null &&
    progress_target != null &&
    progress_percentage != null;

  const handleOpenModal = (): void => {
    open({ trophy_id: trophy.id, game_id: game?.id });
  };

  if (filters.earned === "earned" && !checked) return null;
  if (filters.earned === "unearned" && checked) return null;

  return (
    <Flex
      className={cx(classes.container, checked && classes.checked, "trophy")}
    >
      <TrophyBadge {...props} checked={checked} />
      <Flex className={classes.content}>
        <Image
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className={classes.icon}
          alt={name ?? "trophy icon url"}
          src={icon_url ?? ""}
        />
        <Flex className={classes.info}>
          {name != null && (
            <Flex mb="xs" align="center">
              <Text fw="bold" strikethrough={checked}>
                {name}
              </Text>
              {checked && earnedDateTime != null && (
                <Badge
                  ml="xs"
                  leftSection={<IconCheck size="0.75rem" />}
                  style={{
                    textDecoration: checked ? "line-through" : "none",
                  }}
                >
                  {dayjs(earnedDateTime).format("DD.MM.YYYY HH:mm")}
                </Badge>
              )}
            </Flex>
          )}
          {detail != null && <Text strikethrough={checked}>{detail}</Text>}
        </Flex>
        {hasProgress && (
          <Flex className={classes.rate}>
            <Title align="center" order={3}>
              {progress_value} / {progress_target}
            </Title>
            <Text align="center">Progress: {progress_percentage}%</Text>
          </Flex>
        )}
        {rare !== undefined && (
          <Flex className={classes.rate}>
            <Title align="center" order={3}>
              {earnedRate}%
            </Title>
            <Text align="center">{rarityLabels[rare]}</Text>
          </Flex>
        )}
        <UnstyledButton className={classes.note} onClick={handleOpenModal}>
          <IconNotes size={32} />
        </UnstyledButton>
      </Flex>
    </Flex>
  );
};

export default memo(TrophyCard);
