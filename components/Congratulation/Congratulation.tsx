"use client";

import { type CongratulationValue } from "@/providers/CongratulationProvider";
import { type MantineGradient, Text } from "@mantine/core";
import { type CSSProperties, type FC } from "react";
import classes from "./Congratulation.module.css";

interface CongratulationProps {
  styles: CSSProperties;
  value: CongratulationValue | null;
}

const messages: Record<CongratulationValue, string> = {
  complete: "100% completion!",
  platinum: "Platinum earned!",
};

const gradients: Record<CongratulationValue, MantineGradient> = {
  complete: { from: "accent.8", to: "accent.9", deg: 45 },
  platinum: { from: "accent.8", to: "accent.9", deg: 45 },
};

const Congratulation: FC<CongratulationProps> = (props) => {
  const { value, styles } = props;

  if (value === null) return null;

  return (
    <div className={classes.container} style={styles}>
      <Text
        className={classes.title}
        variant="gradient"
        gradient={gradients[value]}>
        Congratulation!
      </Text>
      <Text className={classes.message}>{messages[value]}</Text>
    </div>
  );
};

export default Congratulation;
