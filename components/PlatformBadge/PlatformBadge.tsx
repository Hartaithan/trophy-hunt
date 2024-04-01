import { platformLabels } from "@/constants/board";
import { type Platform } from "@/models/PlatformModel";
import { Badge, Popover, Text } from "@mantine/core";
import { memo, type FC, useMemo } from "react";
import classes from "./PlatformBadge.module.css";
import clsx from "clsx";

interface LabelFormatted {
  single: string | null;
  cross: string[] | null;
}

interface PlatformBadgeProps {
  platform: Platform | null;
}

interface MultiPlatformProps {
  labels: string[] | null;
}

const MultiPlatformPopover: FC<MultiPlatformProps> = (props) => {
  const { labels } = props;
  if (labels == null) return null;
  return (
    <Popover width={120} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Badge
          className={clsx(classes.platform, classes.multi)}
          radius="sm"
          component="button">
          Multi
        </Badge>
      </Popover.Target>
      <Popover.Dropdown p="sm">
        <Text size="xs" ta="center">
          {labels
            .map((i) => platformLabels[i]?.short ?? "Not Found")
            .join(", ")}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

const MemoizedMultiPlatformPopover = memo(MultiPlatformPopover);

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
    return <MemoizedMultiPlatformPopover labels={label.cross} />;
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
