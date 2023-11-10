import { memo, type FC } from "react";
import { Badge, DEFAULT_THEME } from "@mantine/core";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import { columnColors, columnsLabels } from "@/constants/board";
import classes from "./ColumnBadge.module.css";

interface ColumnBadgeProps {
  status: BOARD_COLUMNS | null;
}

const ColumnBadge: FC<ColumnBadgeProps> = (props) => {
  const { status } = props;
  const colors = DEFAULT_THEME.colors;
  const { color, shade } = columnColors[status ?? "backlog"];

  return (
    <Badge
      className={classes.status}
      bg={colors[color][shade] + "80"}
      radius="sm">
      {status !== null ? columnsLabels[status] : "Not Found"}
    </Badge>
  );
};

export default memo(ColumnBadge);
