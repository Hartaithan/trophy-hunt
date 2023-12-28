"use client";

import { type UpdatePasswordBody } from "@/models/AuthModel";
import API from "@/utils/api";
import { Box, Button, Flex, Grid, PasswordInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type FC } from "react";

interface UpdateForm extends UpdatePasswordBody {
  confirm_password: string;
}

const UpdatePasswordForm: FC = () => {
  const form = useForm<UpdateForm>({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validate: {
      current_password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters",
      ),
      new_password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters",
      ),
      confirm_password: (value, values) =>
        value !== values.new_password ? "Passwords did not match" : null,
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values): void => {
    const payload: UpdatePasswordBody = {
      current_password: values.current_password,
      new_password: values.new_password,
    };
    API.put("/profile/password", payload)
      .then(({ data }) => {
        notifications.show({
          title: "Success!",
          message: data.message,
          autoClose: 3000,
        });
        form.resetDirty();
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("update password form error", error);
      });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <PasswordInput
            label="Current Password"
            placeholder="Current Password"
            {...form.getInputProps("current_password")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <PasswordInput
            label="New password"
            placeholder="New password"
            {...form.getInputProps("new_password")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            {...form.getInputProps("confirm_password")}
          />
        </Grid.Col>
      </Grid>
      <Flex justify="flex-end">
        <Button type="submit" w={150} mt="xl" disabled={!form.isValid()}>
          Update!
        </Button>
      </Flex>
    </Box>
  );
};

export default UpdatePasswordForm;
