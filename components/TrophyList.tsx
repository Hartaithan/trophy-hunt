import { type IFormattedResponse } from "@/models/TrophyModel";
import { type FC } from "react";
import TrophyCard from "./TrophyCard";
import { Box, Flex, Text, createStyles, Stack } from "@mantine/core";
import Image from "next/image";

interface ITrophyListProps {
  trophies: IFormattedResponse | null;
}

const useStyles = createStyles(({ spacing }) => ({
  group: {
    marginBottom: spacing.md,
  },
  groupIcon: { height: "auto", objectFit: "contain" },
  groupInfo: {
    marginLeft: spacing.md,
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const TrophyList: FC<ITrophyListProps> = (props) => {
  const { trophies } = props;
  const { classes } = useStyles();

  if (trophies === null) return null;

  return (
    <div>
      {trophies.groups.map((group) => (
        <Box key={group.id}>
          <Flex className={classes.group}>
            <Image
              width={150}
              height={100}
              className={classes.groupIcon}
              src={group.icon_url}
              alt={group.name ?? "group icon url"}
            />
            <Flex className={classes.groupInfo}>
              <Text fw="bold">{group.name}</Text>
              <Text>
                {group.counts.platinum > 0 && (
                  <Text span inherit>
                    {`Platinum: ${group.counts.platinum}, `}
                  </Text>
                )}
                {group.counts.gold > 0 && (
                  <Text span inherit>
                    {`Gold: ${group.counts.gold}, `}
                  </Text>
                )}
                {group.counts.silver > 0 && (
                  <Text span inherit>
                    {`Silver: ${group.counts.silver}, `}
                  </Text>
                )}
                {group.counts.bronze > 0 && (
                  <Text span inherit>
                    {`Bronze: ${group.counts.bronze}`}
                  </Text>
                )}
              </Text>
            </Flex>
          </Flex>
          <Stack>
            {group.trophies.map((trophy) => (
              <TrophyCard key={trophy.id} trophy={trophy} />
            ))}
          </Stack>
        </Box>
      ))}
    </div>
  );
};

export default TrophyList;
