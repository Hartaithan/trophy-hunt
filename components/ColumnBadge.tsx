import { type FC } from "react";
import { Badge, createStyles } from "@mantine/core";
import { columnColors, columnsLabels } from "@/constants/board";
import { type BOARD_COLUMNS } from "@/models/BoardModel";

interface IColumnBadgeProps {
  status: BOARD_COLUMNS | null;
}

const useStyles = createStyles(({ colors }, { status }: IColumnBadgeProps) => {
  const { color, shade } = columnColors[status ?? "backlog"];
  return {
    status: {
      background: colors[color][shade] + "80",
      color: colors.gray[0],
    },
  };
});

const ColumnBadge: FC<IColumnBadgeProps> = (props) => {
  const { status } = props;
  const { classes } = useStyles(props);

  return (
    <Badge className={classes.status} radius="sm">
      {status !== null ? columnsLabels[status] : "Not Found"}
    </Badge>
  );
};

export default ColumnBadge;
