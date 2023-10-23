import ProfileBlock from "@/components/ProfileBlock";
import TrophiesStats from "@/components/TrophiesStats";
import { type Page } from "@/models/AppModel";
import { Button, Flex, Stack, Title } from "@mantine/core";
import Link from "next/link";

const ProfilePage: Page = () => {
  return (
    <Flex direction="column" py="xl">
      <Flex mb="md" justify="space-between">
        <Title order={3}>Profile</Title>
        <Button
          component={Link}
          prefetch={false}
          href="/profile/edit"
          type="submit"
          w={150}
        >
          Edit Profile
        </Button>
      </Flex>
      <Stack>
        <ProfileBlock />
        <TrophiesStats />
      </Stack>
    </Flex>
  );
};

export default ProfilePage;
