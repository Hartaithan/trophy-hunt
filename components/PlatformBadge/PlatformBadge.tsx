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
  const label =
    platform !== null ? platformLabels[platform.toLowerCase()] : undefined;
  return (
    <Badge className={classes.platform} radius="sm">
      {label != null
        ? label.short
        : platform?.replaceAll(",", ", ") ?? "Not Found"}
    </Badge>
  );
};

export default memo(PlatformBadge);
