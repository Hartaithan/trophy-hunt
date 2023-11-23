"use client";

import { type ForgotBody } from "@/models/AuthModel";
import API from "@/utils/api";
import { Box, Button, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type FC } from "react";

const ForgotForm: FC = () => {
  const form = useForm<ForgotBody>({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email"),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values): void => {
    API.post("/auth/forgot", values)
      .then(({ data }) => {
        notifications.show({
          title: "Success!",
          message: data.message,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("forgot request form error", error);
      });
  };

  return (
    <Box
      component="form"
      w="100%"
      maw={400}
      onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        required
        type="email"
        label="Email"
        placeholder="Enter your email"
        {...form.getInputProps("email")}
      />
      <Button type="submit" mt="xl" disabled={!form.isValid()} fullWidth>
        Submit
      </Button>
    </Box>
  );
};

export default ForgotForm;
