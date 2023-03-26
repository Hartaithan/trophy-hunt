import { type IPage } from "@/models/AppModel";
import { type ISignUpBody } from "@/models/AuthModel";
import { Button, Flex, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SignUpPage: IPage = () => {
  const form = useForm<ISignUpBody>({
    initialValues: {
      email: "",
      password: "",
      npsso: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
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
      .then((data) => {
        console.info("data", data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <Flex w="100%" h="100%" direction="column" justify="center" align="center">
      <form style={{ width: "40%" }} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
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
    </Flex>
  );
};

export default SignUpPage;
