import Link from "@/components/Link";
import API from "@/helpers/api";
import { type Page } from "@/models/AppModel";
import {
  Anchor,
  Box,
  Button,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SignInPage: Page = () => {
  const { reload } = useRouter();

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
        "Password should include at least 6 characters"
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
        reload();
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
    <Flex direction="column" justify="center" align="center">
      <Title order={2} align="center" mb="md">
        Welcome back!
      </Title>
      <Box
        component="form"
        w="100%"
        maw={400}
        onSubmit={form.onSubmit(handleSubmit)}
      >
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
        <Button type="submit" mt="xl" fullWidth disabled={!form.isValid()}>
          Sign in!
        </Button>
      </Box>
      <Text align="center" mt="md" fw={500} size="sm">
        Don&apos;t have an account?&nbsp;
        <Anchor
          component={Link}
          href="/signUp"
          span
          color="accented.9"
          td="underline"
        >
          Sign Up!
        </Anchor>
      </Text>
    </Flex>
  );
};

export default SignInPage;
