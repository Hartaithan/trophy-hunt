"use client";

import TutorialDrawer from "@/components/TutorialDrawer/TutorialDrawer";
import TutorialTrigger from "@/components/TutorialTrigger/TutorialTrigger";
import API, { API_URL } from "@/utils/api";
import {
  Anchor,
  Box,
  Button,
  Group,
  InputLabel,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "@/components/Link/Link";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import AuthTip from "@/components/AuthTip/AuthTip";

const SignInForm: FC = () => {
  const { refresh } = useRouter();
  const [opened, { open, close }] = useDisclosure();

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
        window.location.replace(window.location.pathname);
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
      maw={{ base: "95%", sm: 400 }}
      onSubmit={form.onSubmit(handleSubmit)}>
      <AuthTip />
      <Stack gap="md">
        <TextInput
          required
          label="Email"
          placeholder="Your Email"
          {...form.getInputProps("email")}
        />
        <Box>
          <Group justify="space-between">
            <InputLabel required size="sm" fw={500}>
              Password
            </InputLabel>
            <Anchor href="/forgot" component={Link} mb={5} fw={500} fz="xs">
              Forgot your password?
            </Anchor>
          </Group>
          <PasswordInput
            required
            placeholder="Your password"
            {...form.getInputProps("password")}
          />
        </Box>
        <Box>
          <TutorialTrigger open={open} />
          <TextInput
            required
            placeholder="Your NPSSO"
            {...form.getInputProps("npsso")}
          />
        </Box>
      </Stack>
      <Button type="submit" mt="xl" fullWidth disabled={!form.isValid()}>
        Sign in!
      </Button>
      <TutorialDrawer opened={opened} onClose={close} />
    </Box>
  );
};

export default SignInForm;
