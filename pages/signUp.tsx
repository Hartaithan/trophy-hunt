import { useState } from "react";
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
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useStyles = createStyles(() => ({
  form: {
    width: "100%",
    maxWidth: 400,
  },
}));

const SignUpPage: IPage = () => {
  const { classes } = useStyles();
  const [user, setUser] = useState<IUser | null>(null);

  const form = useForm<ISignUpBody>({
    initialValues: {
      email: "",
      password: "",
      npsso: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters"
      ),
      npsso: hasLength(64, "NPSSO must have exactly 64 characters"),
    },
  });

  const handleSubmit = (values: typeof form.values): void => {
    if (API_URL === undefined) {
      console.error("API_URL not found");
      return;
    }
    fetch(`${API_URL}/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then(async (response) => await response.json())
      .then(({ user }) => {
        setUser(user);
      })
      .catch((error) => {
        // TODO: add error notifications
        console.error("sign up error", error);
      });
  };

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
          <Button type="submit" mt="xl" fullWidth>
            Sign up!
          </Button>
        </form>
      )}
    </Flex>
  );
};

export default SignUpPage;
