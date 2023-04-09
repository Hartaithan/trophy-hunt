import { useState, forwardRef } from "react";
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
} from "@mantine/core";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import API from "@/api/API";
import { locales } from "@/constants/locales";
import { type ILocale } from "@/models/LocaleModel";

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
  const [user, setUser] = useState<IUser | null>(null);

  const form = useForm<ISignUpBody>({
    initialValues: {
      email: "",
      password: "",
      npsso: "",
      lang: "en-US",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 6 },
        "Password should include at least 6 characters"
      ),
      npsso: hasLength(64, "NPSSO must have exactly 64 characters"),
      lang: isNotEmpty("Language is required"),
    },
  });

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
          <Button type="submit" mt="xl" fullWidth>
            Sign up!
          </Button>
        </form>
      )}
    </Flex>
  );
};

export default SignUpPage;
