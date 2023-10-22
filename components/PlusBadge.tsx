import { Badge, type BadgeProps, createStyles } from "@mantine/core";
import { type FC } from "react";

const useStyles = createStyles(({ colors }) => ({
  platform: {
    background: colors.yellow[7],
    "& > span": {
      color: colors.yellow[0],
    },
  },
}));

const PlusBadge: FC<BadgeProps> = (props) => {
  const { classes } = useStyles();
  return (
    <Badge className={classes.platform} radius="sm" {...props}>
      PS Plus
    </Badge>
  );
};

export default PlusBadge;
