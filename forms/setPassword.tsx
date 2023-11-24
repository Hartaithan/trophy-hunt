"use client";

import { type SetPasswordBody } from "@/models/AuthModel";
import API from "@/utils/api";
import { Box, Button, PasswordInput, Stack } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type FC } from "react";
import { useRouter } from "next/navigation";

interface SetForm extends SetPasswordBody {
  confirm_password: string;
}

const SetPasswordForm: FC = () => {
  const { push } = useRouter();
  const form = useForm<SetForm>({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validate: {
      password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters",
      ),
      confirm_password: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values): void => {
    const payload: SetPasswordBody = {
      password: values.password,
    };
    API.post("/profile/password", payload)
      .then(({ data }) => {
        notifications.show({
          title: "Success!",
          message: data.message,
          autoClose: 3000,
        });
        push("/signIn");
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("set password form error", error);
      });
  };

  return (
    <Box
      component="form"
      w="100%"
      maw={400}
      onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <PasswordInput
          label="New password"
          placeholder="New password"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm Password"
          {...form.getInputProps("confirm_password")}
        />
      </Stack>
      <Button type="submit" mt="xl" fullWidth disabled={!form.isValid()}>
        Confirm!
      </Button>
    </Box>
  );
};

export default SetPasswordForm;
