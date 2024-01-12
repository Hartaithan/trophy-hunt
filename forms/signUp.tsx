"use client";

import {
  useState,
  type FC,
  useCallback,
  useEffect,
  type ReactNode,
  Fragment,
} from "react";
import {
  Loader,
  Flex,
  Title,
  Text,
  Box,
  Stack,
  TextInput,
  Input,
  PasswordInput,
  Select,
  Button,
  Anchor,
} from "@mantine/core";
import { IconUserCheck, IconUserX } from "@tabler/icons-react";
import { type SignUpBody, type User } from "@/models/AuthModel";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import API from "@/utils/api";
import { API_URL } from "@/constants/api";
import { notifications } from "@mantine/notifications";
import Link from "@/components/Link/Link";
import { profileTypeOptions } from "@/constants/options";
import { mantineTheme } from "@/styles/theme";
import { usernameRegex } from "@/constants/regex";
import LanguageSelect from "@/components/LanguageSelect/LanguageSelect";
import { createClient } from "@/utils/supabase/browser";
import TutorialTrigger from "@/components/TutorialTrigger/TutorialTrigger";
import TutorialDrawer from "@/components/TutorialDrawer/TutorialDrawer";
import AuthTip from "@/components/AuthTip/AuthTip";
import classes from "../styles/Form.module.css";

type Status = "idle" | "checking" | "notUnique" | "unique";

const statusIcons: Record<Status, ReactNode> = {
  idle: undefined,
  checking: <Loader size="xs" />,
  unique: <IconUserCheck size={20} color={mantineTheme.colors.green[8]} />,
  notUnique: <IconUserX size={20} color={mantineTheme.colors.red[8]} />,
};

const SignUpForm: FC = () => {
  const supabase = createClient();
  const [opened, { open, close }] = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const isChecking = status === "checking";
  const isUnique = status === "unique";

  const form = useForm<SignUpBody>({
    initialValues: {
      email: "",
      username: "",
      password: "",
      npsso: "",
      language: "en-US",
      type: "public",
    },
    validate: {
      email: isEmail("Invalid email"),
      username: (value) =>
        usernameRegex.test(value)
          ? null
          : "Username can only include letters, numbers, dashes and underscores",
      password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters",
      ),
      npsso: hasLength(64, "NPSSO must have exactly 64 characters"),
      language: isNotEmpty("Language is required"),
    },
    validateInputOnChange: ["username"],
  });

  const [username] = useDebouncedValue(form.values.username, 500);

  const handleSubmit = (values: typeof form.values): void => {
    if (API_URL === undefined) {
      console.error("API_URL not found");
      return;
    }
    API.post("/auth/signUp", JSON.stringify(values))
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch((error) => {
        const message = error.response?.data?.message ?? "Unable to sign up";
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message,
          autoClose: false,
        });
        if (error.response.status === 405) {
          form.setFieldError("email", message);
        }
        console.error("sign up error", error);
      });
  };

  const isUsernameUnique = useCallback(async (): Promise<boolean> => {
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();
    return error != null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    if (username.length === 0 || !form.isValid("username")) return;
    setStatus("checking");
    isUsernameUnique()
      .then((unique) => {
        setStatus(unique ? "unique" : "notUnique");
      })
      .catch((error) => {
        console.error("check if username unique error", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, isUsernameUnique]);

  if (user != null) {
    return (
      <Flex direction="column" justify="center" ta="center">
        <Title order={3} ta="center">
          Hello, {user.user_metadata.onlineId}
        </Title>
        <Text ta="center">
          Welcome to&nbsp;
          <Text span c="accent">
            Trophy Hunt
          </Text>
        </Text>
        <Text ta="center" w="100%" maw={{ base: "95%", sm: 400 }} mt="xs">
          We created an account for you. Please confirm your e-mail address and
          use our service to the maximum
        </Text>
      </Flex>
    );
  }

  return (
    <Fragment>
      <Title className={classes.heading} order={2} ta="center" mb="md">
        Let&apos;s get started!
      </Title>
      <AuthTip />
      <Box
        component="form"
        w="100%"
        maw={{ base: "95%", sm: 400 }}
        onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            type="email"
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
          />
          <Input.Wrapper id="username">
            <Flex justify="space-between" align="flex-end">
              <Input.Label required>Username</Input.Label>
              {form.values.username.length > 0 && !isChecking && (
                <Input.Label size="xs" c={isUnique ? "green.8" : "red.8"}>
                  {isUnique ? "Username is unique" : "Username already taken"}
                </Input.Label>
              )}
              {form.values.username.length > 0 && isChecking && (
                <Input.Label size="xs" c={isUnique ? "green.8" : "red.8"}>
                  Checking...
                </Input.Label>
              )}
            </Flex>
            <Input
              id="username"
              required
              autoComplete="off"
              placeholder="Enter your username"
              rightSection={statusIcons[status]}
              {...form.getInputProps("username")}
              onChange={(e) => {
                const value = e.target.value;
                setStatus(value.length > 0 ? "checking" : "idle");
                form.setFieldValue("username", e.target.value);
              }}
            />
          </Input.Wrapper>
          <PasswordInput
            required
            type="password"
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />
          <Box>
            <TutorialTrigger open={open} />
            <TextInput
              type="text"
              placeholder="Enter your NPSSO"
              {...form.getInputProps("npsso")}
            />
          </Box>
          <LanguageSelect
            required
            value={form.values.language}
            onChange={(value) => {
              form.setFieldValue("language", value ?? "en-US");
            }}
          />
          <Select
            required
            data={profileTypeOptions}
            label="Profile type"
            placeholder="Pick profile type"
            {...form.getInputProps("type")}
          />
        </Stack>
        <Button
          type="submit"
          mt="xl"
          disabled={!form.isValid() || isChecking || !isUnique}
          fullWidth>
          Sign up!
        </Button>
      </Box>
      <Text ta="center" mt="xl" size="sm" fw={500}>
        Already have account?&nbsp;
        <Anchor component={Link} href="/signIn" c="accented.9" td="underline">
          Sign In!
        </Anchor>
      </Text>
      <TutorialDrawer opened={opened} onClose={close} />
    </Fragment>
  );
};

export default SignUpForm;
