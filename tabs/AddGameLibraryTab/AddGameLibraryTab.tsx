"use client";

import LibraryItem from "@/components/LibaryItem/LibraryItem";
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

interface Pagination {
  previousOffset: number | undefined;
  nextOffset: number | undefined;
  totalItemCount: number | undefined;
}

type Status = "idle" | "loading" | "completed" | "fetching";

const limit = 5;

const AddGameLibraryTab: FC<Props> = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [titles, setTitles] = useState<TrophyTitle[] | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    previousOffset: undefined,
    nextOffset: undefined,
    totalItemCount: undefined,
  });
  const isLoading = status === "loading";
  const isFetching = status === "fetching";

  const fetchTitles = useCallback(() => {
    setStatus("loading");
    API.get("/games/library", { params: { limit, offset: 0 } })
      .then(({ data }) => {
        const titlesRes = data?.trophyTitles ?? [];
        setTitles(titlesRes);
        setPagination({
          previousOffset: data?.previousOffset,
          nextOffset: data?.nextOffset,
          totalItemCount: data?.totalItemCount,
        });
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

  const fetchMoreTitles = useCallback(() => {
    setStatus("fetching");
    API.get("/games/library", {
      params: { limit, offset: pagination.nextOffset },
    })
      .then(({ data }) => {
        const titlesRes = data?.trophyTitles ?? [];
        setTitles((prev) => {
          if (prev == null) return prev;
          return [...prev, ...titlesRes];
        });
        setPagination({
          previousOffset: data?.previousOffset,
          nextOffset: data?.nextOffset,
          totalItemCount: data?.totalItemCount,
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("fetch more games library error", error);
      })
      .finally(() => {
        setStatus("completed");
      });
  }, [pagination]);

  return (
    <Flex direction="column">
      {titles == null && (
        <Button
          fullWidth
          leftSection={<IconLibrary size={20} />}
          onClick={fetchTitles}
          disabled={isLoading}>
          Browse library
        </Button>
      )}
      {isLoading && (
        <Flex mt="md" w="100%" justify="center" align="center">
          <Loader />
        </Flex>
      )}
      {!isLoading && titles != null && (
        <Stack>
          {titles?.map((title, index) => (
            <LibraryItem key={title.trophyTitleName + index} item={title} />
          ))}
        </Stack>
      )}
      {!isLoading &&
        titles != null &&
        titles.length > 0 &&
        pagination.nextOffset != null && (
          <Button
            variant="subtle"
            mt="md"
            onClick={fetchMoreTitles}
            disabled={pagination.nextOffset == null}
            leftSection={isFetching && <Loader size="xs" />}>
            Fetch more
          </Button>
        )}
    </Flex>
  );
};

export default AddGameLibraryTab;
