"use client";

import useEffectOnce from "@/hooks/useEffectOnce";
import { notifications } from "@mantine/notifications";
import { type FC } from "react";

interface Props {
  success: string | undefined;
}

const SuccessNotification: FC<Props> = (props) => {
  const { success } = props;

  useEffectOnce(() => {
    if (success == null) return;
    notifications.show({
      title: "Success!",
      message: "Email successfully confirmed. Use our service to the maximum!",
      autoClose: 3000,
    });
  });

  return null;
};

export default SuccessNotification;
