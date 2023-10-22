import { type CongratulationValue } from "@/providers/CongratulationProvider";
import { type MantineGradient, Title, createStyles } from "@mantine/core";
import { type CSSProperties, type FC } from "react";

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

const useStyles = createStyles(() => ({
  container: {
    zIndex: 99999,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "30vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: `linear-gradient(0deg, transparent 0%,#000000 100%)`,
    pointerEvents: "none",
  },
}));

const Congratulation: FC<CongratulationProps> = (props) => {
  const { value, styles } = props;
  const { classes } = useStyles();

  if (value === null) return null;

  return (
    <div className={classes.container} style={styles}>
      <Title variant="gradient" gradient={gradients[value]}>
        Congratulation!
      </Title>
      <Title order={3}>{messages[value]}</Title>
    </div>
  );
};

export default Congratulation;
