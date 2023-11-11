import { platformLabels } from "@/constants/board";
import { type Platform } from "@/models/PlatformModel";
import { Badge } from "@mantine/core";
import { memo, type FC } from "react";
import classes from "./PlatformBadge.module.css";

interface PlatformBadgeProps {
  platform: Platform | null;
}

const PlatformBadge: FC<PlatformBadgeProps> = (props) => {
  const { platform } = props;
  return (
    <Badge className={classes.platform} radius="sm">
      {platform !== null ? platformLabels[platform].short : "Not Found"}
    </Badge>
  );
};

export default memo(PlatformBadge);
