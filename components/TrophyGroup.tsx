import { type TrophyCountItem, type IGroup } from "@/models/TrophyModel";
import {
  Text,
  Flex,
  createStyles,
  Badge,
  Checkbox,
  Title,
} from "@mantine/core";
import Image from "./Image";
import { useMemo, type FC, type ChangeEventHandler } from "react";
import TrophyCounts from "./TrophyCounts";
import { useGame } from "@/providers/GameProvider";

interface ITrophyGroupProps {
  group: IGroup;
}

interface Checked {
  count: number;
  earned: number;
  label: string;
  isAll: boolean;
  incomplete: boolean;
}

const emptyProgress: Checked = {
  count: 0,
  earned: 0,
  label: "",
  isAll: false,
  incomplete: false,
};

const useStyles = createStyles(({ spacing, radius, colors }) => ({
  container: {
    position: "sticky",
    top: spacing.md,
    minHeight: 100,
    width: "100%",
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.sm,
    zIndex: 10,
    alignItems: "center",
  },
  icon: {
    width: "auto",
    objectFit: "contain",
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const TrophyGroup: FC<ITrophyGroupProps> = (props) => {
  const { group } = props;
  const { classes } = useStyles();
  const { progress, checkGroup } = useGame();

  const { id, icon_url, name, count, counts } = group;

  const countsArray: TrophyCountItem[] = Object.entries(counts).reverse();

  const checked = useMemo<Checked>(() => {
    if (progress.length === 0) return emptyProgress;
    let count = 0;
    let earned = 0;
    for (let i = 0; i < progress.length; i++) {
      const el = progress[i];
      const isMatch = el.group === id;
      const isEarned = el.earned;
      count = count + (isMatch ? 1 : 0);
      earned = earned + (isMatch && isEarned ? 1 : 0);
    }
    return {
      count,
      earned,
      label: `${earned} / ${count}`,
      isAll: count === earned,
      incomplete: count === earned ? false : earned !== 0,
    };
  }, [id, progress]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    checkGroup(id, !checked.isAll);
  };

  return (
    <Flex className={classes.container}>
      <Image
        width={150}
        height={80}
        className={classes.icon}
        src={icon_url}
        alt={name ?? "group icon url"}
      />
      <Flex className={classes.info}>
        <Flex align="center" mb="xs">
          <Text fw="bold">{name}</Text>
          <Badge ml="sm">{id === "default" ? "Base Game" : "DLC"}</Badge>
        </Flex>
        <TrophyCounts counts={countsArray} count={count} />
      </Flex>
      <Flex align="center">
        <Title
          order={4}
          mr="md"
          td={checked.isAll ? "line-through" : "unset"}
          c={checked.isAll ? "dimmed" : undefined}
        >
          {checked.label}
        </Title>
        <Checkbox
          checked={checked.isAll}
          indeterminate={checked.incomplete}
          onChange={handleChange}
          radius="md"
          size="lg"
          mr="md"
        />
      </Flex>
    </Flex>
  );
};

export default TrophyGroup;
