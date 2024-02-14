import { platformLabels } from "@/constants/board";
import { type Platform } from "@/models/PlatformModel";
import { Badge } from "@mantine/core";
import { memo, type FC, useMemo } from "react";
import classes from "./PlatformBadge.module.css";

interface PlatformBadgeProps {
  platform: Platform | null;
}

interface LabelFormatted {
  single: string | null;
  cross: string[] | null;
}

const PlatformBadge: FC<PlatformBadgeProps> = (props) => {
  const { platform } = props;

  const label: LabelFormatted | null = useMemo(() => {
    if (platform == null) return null;
    if (platform.includes(","))
      return { single: null, cross: platform.toLowerCase().split(",") };
    return {
      single: platform.toLowerCase(),
      cross: null,
    };
  }, [platform]);

  if (label?.cross != null && label.cross.length > 0) {
    return label.cross.map((i) => (
      <Badge key={i} className={classes.platform} radius="sm">
        {platformLabels[i]?.short ?? "Not Found"}
      </Badge>
    ));
  }

  return (
    <Badge className={classes.platform} radius="sm">
      {label?.single != null
        ? platformLabels[label.single]?.short
        : "Not Found"}
    </Badge>
  );
};

export default memo(PlatformBadge);
