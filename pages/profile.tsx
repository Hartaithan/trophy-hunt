import LanguageSelect from "@/components/LanguageSelect";
import API from "@/helpers/api";
import { type IPage } from "@/models/AppModel";
import { type IProfile } from "@/models/AuthModel";
import { Box, Button, Flex, Group, TextInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type GetServerSideProps } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface IProfilePageProps {
  profile: IProfile | null;
  message?: string;
}

export const getServerSideProps: GetServerSideProps<IProfilePageProps> = async (
  ctx
) => {
  if (API_URL === undefined) {
    console.error("env variables not found");
    return { props: { profile: null, message: "Something wrong..." } };
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: ctx.req.headers.cookie ?? "",
      },
    }).then(async (res) => await res.json());
    return {
      props: { profile: response.profile ?? null },
    };
  } catch (error) {
    console.error("unable to fetch profile", error);
    return {
      props: { profile: null, message: "Unable to fetch profile" },
    };
  }
};

const ProfilePage: IPage<IProfilePageProps> = (props) => {
  const { profile } = props;

  const form = useForm({
    initialValues: {
      username: profile?.username ?? "",
      language: profile?.language ?? "en-US",
    },
    validate: {
      username: (value) =>
        /^[\w-_]*$/.test(value)
          ? null
          : "Username can only include letters, numbers, dashes and underscores",
      language: isNotEmpty("Language is required"),
    },
    validateInputOnChange: ["username"],
  });

  const handleSubmit = (values: typeof form.values): void => {
    if (API_URL == null) {
      console.error("API_URL not found");
      return;
    }
    API.put("/profile", JSON.stringify(values))
      .then((res) => {
        notifications.show({
          title: "Success!",
          message: res.data.message,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("edit profile error", error);
      });
  };

  return (
    <Flex w="100%" h="100%" direction="column" py="xl">
      <Title order={3} mb="md">
        Edit Profile
      </Title>
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Group grow>
          <TextInput
            required
            label="Username"
            placeholder="Your username"
            {...form.getInputProps("username")}
          />
          <LanguageSelect
            value={form.values.language}
            onChange={(value) =>
              form.setFieldValue("language", value ?? "en-US")
            }
          />
        </Group>
        <Flex justify="flex-end">
          <Button type="submit" w={150} mt="xl">
            Update!
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ProfilePage;
