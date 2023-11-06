import { Badge, type BadgeProps } from "@mantine/core";
import { type FC } from "react";
import classes from "./PlusBadge.module.css";

interface PlusBadgeProps extends BadgeProps {
  label?: string;
}

const PlusBadge: FC<PlusBadgeProps> = (props) => {
  const { label = "PS Plus", radius = "sm", ...rest } = props;
  return (
    <Badge className={classes.platform} radius={radius} {...rest}>
      {label}
    </Badge>
  );
};

export default PlusBadge;
