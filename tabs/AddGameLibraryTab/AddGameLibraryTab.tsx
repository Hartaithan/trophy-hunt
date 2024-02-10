"use client";

import { type AddGameState } from "@/models/GameModel";
import API from "@/utils/api";
import { Button, Flex, Loader, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLibrary } from "@tabler/icons-react";
import { type TrophyTitle } from "psn-api";
import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useState,
  useCallback,
} from "react";

interface Props {
  state: AddGameState;
  onClose: () => void;
  setSubmit: Dispatch<SetStateAction<boolean>>;
}

type Status = "idle" | "loading" | "completed" | "fetching";

const AddGameLibraryTab: FC<Props> = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [titles, setTitles] = useState<TrophyTitle[] | null>(null);
  const isLoading = status === "loading";

  const fetchTitles = useCallback(() => {
    setStatus("loading");
    API.get("/games/library", { params: { limit: 10, offset: 0 } })
      .then(({ data }) => {
        const titlesRes = data?.trophyTitles ?? [];
        setTitles(titlesRes);
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("fetch games library error", error);
      })
      .finally(() => {
        setStatus("completed");
      });
  }, []);

  return (
    <Flex direction="column">
      <Button
        fullWidth
        leftSection={<IconLibrary size={20} />}
        onClick={fetchTitles}
        disabled={isLoading}>
        Browse library
      </Button>
      {isLoading && (
        <Flex mt="md" w="100%" justify="center" align="center">
          <Loader />
        </Flex>
      )}
      <Stack mt="md">
        {!isLoading &&
          titles?.map((title, index) => (
            <p key={title.trophyTitleName + index}>{title.trophyTitleName}</p>
          ))}
      </Stack>
    </Flex>
  );
};

export default AddGameLibraryTab;
