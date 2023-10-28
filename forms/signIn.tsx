"use client";

import API, { API_URL } from "@/utils/api";
import { Box, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { type FC } from "react";

const SignInForm: FC = () => {
  const { refresh } = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      npsso: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters",
      ),
      npsso: hasLength(64, "NPSSO must have exactly 64 characters"),
    },
  });

  const handleSubmit = (values: typeof form.values): void => {
    if (API_URL == null) {
      console.error("API_URL not found");
      return;
    }
    API.post("/auth/signIn", JSON.stringify(values))
      .then(() => {
        refresh();
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("sign in error", error);
      });
  };

  return (
    <Box
      component="form"
      w="100%"
      maw={400}
      onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          required
          label="Email"
          placeholder="Your Email"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps("password")}
        />
        <TextInput
          required
          label="NPSSO"
          placeholder="Your NPSSO"
          {...form.getInputProps("npsso")}
        />
      </Stack>
      <Button type="submit" mt="xl" fullWidth disabled={!form.isValid()}>
        Sign in!
      </Button>
    </Box>
  );
};

export default SignInForm;
