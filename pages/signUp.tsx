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
} from "@mantine/core";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useDebouncedValue } from "@mantine/hooks";
import { UserCheck, UserX } from "tabler-icons-react";
import API from "@/helpers/api";
import { notifications } from "@mantine/notifications";
import LanguageSelect from "@/components/LanguageSelect";

type Status = "idle" | "checking" | "notUnique" | "unique";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useStyles = createStyles(() => ({
  username: {
    position: "relative",
  },
  unique: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: "0.875rem",
    lineHeight: 1.55,
  },
}));

const SignUpPage: IPage = () => {
  const { classes } = useStyles();
  const supabase = useSupabaseClient();
  const { colors } = useMantineTheme();
  const [user, setUser] = useState<IUser | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const isChecking = status === "checking";
  const isUnique = status === "unique";

  const statusIcons: Record<Status, ReactNode> = useMemo(
    () => ({
      idle: undefined,
      checking: <Loader size="xs" />,
      unique: <UserCheck size={20} color={colors.green[8]} />,
      notUnique: <UserX size={20} color={colors.red[8]} />,
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
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
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
    <Flex w="100%" h="100%" direction="column" justify="center" align="center">
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
          <Stack>
            <TextInput
              required
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
            />
            <Box className={classes.username}>
              {form.values.username.length > 0 && !isChecking && (
                <Text
                  className={classes.unique}
                  color={isUnique ? colors.green[8] : colors.red[8]}
                >
                  {isUnique ? "Username is unique" : "Username already taken"}
                </Text>
              )}
              {form.values.username.length > 0 && isChecking && (
                <Text className={classes.unique} color={colors.dark[0]}>
                  Checking...
                </Text>
              )}
              <TextInput
                required
                type="text"
                label="Username"
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
            </Box>
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
        </Box>
      )}
    </Flex>
  );
};

export default SignUpPage;
