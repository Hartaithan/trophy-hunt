import { type Trophy } from "@/models/TrophyModel";
import { useGame } from "@/providers/GameProvider";
import { Checkbox, Flex, createStyles } from "@mantine/core";
import { memo, type FC, type ChangeEventHandler } from "react";
import Image from "./Image";

interface TrophyBadgeProps {
  trophy: Trophy;
  checked: boolean;
}

const useStyles = createStyles(({ colors, spacing, radius }) => ({
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
}));

const TrophyBadge: FC<TrophyBadgeProps> = (props) => {
  const { trophy, checked } = props;
  const { classes } = useStyles();
  const { toggleTrophy } = useGame();

  const { id, type } = trophy;

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    toggleTrophy(id);
  };

  return (
    <Flex className={classes.badge}>
      <Image
        width={30}
        height={30}
        alt="trophy type icon"
        src={`/trophy/${type}.png`}
      />
      <Checkbox checked={checked} onChange={handleChange} size="md" />
    </Flex>
  );
};

export default memo(TrophyBadge);
