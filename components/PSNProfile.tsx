import { type NullablePSNProfile } from "@/models/AuthModel";
import { Flex, createStyles, Text } from "@mantine/core";
import { type FC } from "react";
import ImageWithFallback from "./Image";
import { getName, getPresence } from "@/helpers/profile";

interface IPSNProfileProps {
  profile: NullablePSNProfile | undefined;
}

const useStyles = createStyles(({ spacing, colors, radius }) => ({
  container: {
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
  },
  avatar: {
    marginRight: spacing.md,
  },
}));

const PSNProfile: FC<IPSNProfileProps> = (props) => {
  const { profile } = props;
  const { classes } = useStyles();

  const name = getName(profile);
  const presence = getPresence(profile);

  return (
    <Flex className={classes.container}>
      <ImageWithFallback
        className={classes.avatar}
        height={100}
        width={100}
        src={profile?.avatarUrls[0].avatarUrl ?? ""}
        alt="avatar"
        rounded="50%"
      />
      <Flex direction="column">
        <Text fz="xl" fw={700}>
          {name}
        </Text>
        <Flex gap="sm">
          <Text fw={600}>{profile?.onlineId ?? "PSN ID Not Found"}</Text>
          {presence != null && <Text c="dimmed">{presence}</Text>}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PSNProfile;
