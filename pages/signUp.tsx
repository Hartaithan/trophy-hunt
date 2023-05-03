import { useState, forwardRef, useEffect } from "react";
import { type IPage } from "@/models/AppModel";
import { type IUser, type ISignUpBody } from "@/models/AuthModel";
import {
  Avatar,
  Button,
  createStyles,
  Flex,
  Group,
  Input,
  PasswordInput,
  Select,
  type SelectProps,
  Stack,
  Text,
  TextInput,
  Title,
  Loader,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import { locales } from "@/constants/locales";
import { type ILocale } from "@/models/LocaleModel";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useDebouncedValue } from "@mantine/hooks";
import { UserCheck, UserX } from "tabler-icons-react";
import API from "@/helpers/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useStyles = createStyles(({ spacing }) => ({
  form: {
    width: "100%",
    maxWidth: 400,
  },
  language: {
    position: "relative",
  },
  languageIcon: {
    position: "absolute",
    top: "50%",
    left: spacing.xs,
    transform: "translateY(-50%)",
    zIndex: 10,
  },
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

const SelectStyles: SelectProps["styles"] = ({ spacing }) => ({
  input: {
    paddingLeft: 46,
  },
});

const SelectItem = forwardRef<HTMLDivElement, ILocale>(
  ({ id, label, icon_url, ...rest }: ILocale, ref) => (
    <div ref={ref} {...rest}>
      <Group noWrap>
        <Avatar size={24} src={icon_url} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);

const SignUpPage: IPage = () => {
  const { classes } = useStyles();
  const supabase = useSupabaseClient();
  const { colors } = useMantineTheme();
  const [user, setUser] = useState<IUser | null>(null);
  const [isChecking, setChecking] = useState<boolean>(false);
  const [isUnique, setUnique] = useState<boolean>(false);

  const form = useForm<ISignUpBody>({
    initialValues: {
      email: "",
      username: "",
      password: "",
      npsso: "",
      lang: "en-US",
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
      lang: isNotEmpty("Language is required"),
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
        // TODO: add error notifications
        console.error("sign up error", error);
      });
  };

  const checkUsernameUniqueness = async (): Promise<void> => {
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", form.values.username)
      .single();
    setUnique(error != null);
  };

  useEffect(() => {
    if (debounced.length !== 0 && form.isValid("username")) {
      setChecking(true);
      checkUsernameUniqueness().finally(() => setChecking(false));
    } else {
      setUnique(false);
    }
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
        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
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
                {...form.getInputProps("username")}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 0) {
                    setChecking(true);
                  } else {
                    setChecking(false);
                    setUnique(false);
                  }
                  form.setFieldValue("username", e.target.value);
                }}
                rightSection={
                  isChecking ? (
                    <Loader size="xs" />
                  ) : isUnique ? (
                    <UserCheck size={20} color={colors.green[8]} />
                  ) : (
                    <UserX size={20} color={colors.red[8]} />
                  )
                }
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
            <Input.Wrapper label="Language" required>
              <div className={classes.language}>
                <Avatar
                  className={classes.languageIcon}
                  size={24}
                  src={
                    locales.find((i) => i.value === form.values.lang)?.icon_url
                  }
                />
                <Select
                  data={locales}
                  searchable
                  styles={SelectStyles}
                  itemComponent={SelectItem}
                  {...form.getInputProps("lang")}
                />
              </div>
            </Input.Wrapper>
          </Stack>
          <Button
            type="submit"
            mt="xl"
            disabled={!form.isValid() || isChecking || !isUnique}
            fullWidth
          >
            Sign up!
          </Button>
        </form>
      )}
    </Flex>
  );
};

export default SignUpPage;
