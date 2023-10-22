import { platformLabels } from "@/constants/board";
import { type Platform } from "@/models/PlatformModel";
import { Badge, createStyles } from "@mantine/core";
import { memo, type FC } from "react";

interface PlatformBadgeProps {
  platform: Platform | null;
}

const useStyles = createStyles(({ colors }) => ({
  platform: {
    background: colors.gray[7],
    color: colors.gray[0],
  },
}));

const PlatformBadge: FC<PlatformBadgeProps> = (props) => {
  const { platform } = props;
  const { classes } = useStyles();

  return (
    <Badge className={classes.platform} radius="sm">
      {platform !== null ? platformLabels[platform].short : "Not Found"}
    </Badge>
  );
};

export default memo(PlatformBadge);
