import PSNProfile from "@/components/PSNProfile";
import { type Page } from "@/models/AppModel";
import { useProfiles } from "@/providers/ProfileProvider";
import { Button, Flex, Title } from "@mantine/core";
import Link from "next/link";

const ProfilePage: Page = () => {
  const { psn } = useProfiles();
  return (
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Profile
      </Title>
      <PSNProfile profile={psn} />
      <Flex justify="flex-end">
        <Button
          component={Link}
          prefetch={false}
          href="/profile/edit"
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
