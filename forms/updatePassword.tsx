"use client";

import { type UpdatePasswordBody } from "@/models/AuthModel";
import { Box, Button, Flex, Grid, PasswordInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { type FC } from "react";

const UpdatePasswordForm: FC = () => {
  const form = useForm<UpdatePasswordBody>({
    initialValues: {
      current_password: "",
      new_password: "",
    },
    validate: {
      current_password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters",
      ),
      new_password: (value, values) =>
        value !== values.current_password ? "Passwords did not match" : null,
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values): void => {
    console.info("values", values);
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Grid>
        <Grid.Col span={6}>
          <PasswordInput
            label="Current Password"
            placeholder="Current Password"
            {...form.getInputProps("current_password")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <PasswordInput
            label="New password"
            placeholder="New password"
            {...form.getInputProps("new_password")}
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
