import { type IPage } from "@/models/AppModel";
import { Button, Flex, Title } from "@mantine/core";
import Link from "next/link";

const ProfilePage: IPage = () => {
  return (
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Profile
      </Title>
      <Flex justify="flex-end">
        <Button
          component={Link}
          href="/profile/edit"
          prefetch={false}
          type="submit"
          w={150}
          mt="xl"
        >
          Edit Profile
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
