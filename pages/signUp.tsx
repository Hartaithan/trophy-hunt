import { useState, useEffect, useMemo, type ReactNode } from "react";
import { type IPage } from "@/models/AppModel";
import { type IUser, type ISignUpBody } from "@/models/AuthModel";
import {
  Button,
  createStyles,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Loader,
  useMantineTheme,
  Box,
  Input,
  Anchor,
} from "@mantine/core";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useDebouncedValue } from "@mantine/hooks";
import { IconUserCheck, IconUserX } from "@tabler/icons-react";
import API from "@/helpers/api";
import { notifications } from "@mantine/notifications";
import LanguageSelect from "@/components/LanguageSelect";
import Link from "next/link";

type Status = "idle" | "checking" | "notUnique" | "unique";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useStyles = createStyles(({ colors, fontSizes }, isUnique: boolean) => ({
  unique: {
    fontSize: fontSizes.xs,
    color: isUnique ? colors.green[8] : colors.red[8],
  },
}));

const SignUpPage: IPage = () => {
  const supabase = useSupabaseClient();
  const { colors } = useMantineTheme();
  const [user, setUser] = useState<IUser | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const isChecking = status === "checking";
  const isUnique = status === "unique";
  const { classes } = useStyles(isUnique);

  const statusIcons: Record<Status, ReactNode> = useMemo(
    () => ({
      idle: undefined,
      checking: <Loader size="xs" />,
      unique: <IconUserCheck size={20} color={colors.green[8]} />,
      notUnique: <IconUserX size={20} color={colors.red[8]} />,
    }),
    [] // eslint-disable-line
  );

  const form = useForm<ISignUpBody>({
    initialValues: {
      email: "",
      username: "",
      password: "",
      npsso: "",
      language: "en-US",
    },
    validate: {
      email: isEmail("Invalid email"),
      username: (value) =>
        /^[\w-_]*$/.test(value)
          ? null
          : "Username can only include letters, numbers, dashes and underscores",
      password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters"
      ),
      npsso: hasLength(64, "NPSSO must have exactly 64 characters"),
      language: isNotEmpty("Language is required"),
    },
    validateInputOnChange: ["username"],
  });

  const [debounced] = useDebouncedValue(form.values.username, 500);

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

  const isUsernameUnique = async (): Promise<boolean> => {
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", form.values.username)
      .single();
    return error != null;
  };

  useEffect(() => {
    if (debounced.length === 0 || !form.isValid("username")) return;
    setStatus("checking");
    isUsernameUnique()
      .then((unique) => setStatus(unique ? "unique" : "notUnique"))
      .catch((error) => console.error("check if username unique error", error));
  }, [debounced]); // eslint-disable-line

  return (
    <Flex direction="column" justify="center" align="center">
      {user != null ? (
        <Flex direction="column" justify="center" align="center">
          <Title order={3} align="center">
            Hello, {user.user_metadata.onlineId}
          </Title>
          <Text align="center">
            Welcome to&nbsp;
            <Text span color="accent">
              Trophy Hunt
            </Text>
          </Text>
          <Text align="center" w="100%" maw={400} mt="xs">
            We created an account for you. Please confirm your e-mail address
            and use our service to the maximum
          </Text>
        </Flex>
      ) : (
        <Box
          component="form"
          w="100%"
          maw={400}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Title order={2} align="center" mb="md">
            Let&apos;s get started!
          </Title>
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
                  <Input.Label className={classes.unique}>
                    {isUnique ? "Username is unique" : "Username already taken"}
                  </Input.Label>
                )}
                {form.values.username.length > 0 && isChecking && (
                  <Input.Label className={classes.unique}>
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
            <TextInput
              required
              type="text"
              label="NPSSO"
              placeholder="Enter your NPSSO"
              {...form.getInputProps("npsso")}
            />
            <LanguageSelect
              value={form.values.language}
              onChange={(value) =>
                form.setFieldValue("language", value ?? "en-US")
              }
            />
          </Stack>
          <Button
            type="submit"
            mt="xl"
            disabled={!form.isValid() || isChecking || !isUnique}
            fullWidth
          >
            Sign up!
          </Button>
          <Text align="center" mt="md" size="sm" fw={500}>
            Already have account?&nbsp;
            <Anchor
              component={Link}
              href="/signIn"
              span
              color="accented.9"
              td="underline"
            >
              Sign In!
            </Anchor>
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default SignUpPage;
