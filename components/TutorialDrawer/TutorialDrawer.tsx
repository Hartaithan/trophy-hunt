"use client";

import { Drawer, type DrawerProps } from "@mantine/core";
import { memo, type FC } from "react";

type Props = DrawerProps;

const TutorialDrawer: FC<Props> = (props) => {
  const { ...rest } = props;
  return (
    <Drawer title="Tutorial" position="right" {...rest}>
      Hello World!
    </Drawer>
  );
};

export default memo(TutorialDrawer);
