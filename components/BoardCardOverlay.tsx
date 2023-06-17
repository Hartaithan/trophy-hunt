import { Overlay } from "@mantine/core";
import { memo, type FC } from "react";

const BoardCardOverlay: FC = () => {
  return (
    <Overlay
      zIndex={2}
      gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))"
    />
  );
};

export default memo(BoardCardOverlay);
