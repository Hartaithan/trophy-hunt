"use client";

import LibraryItem from "@/components/LibaryItem/LibraryItem";
import { BOARD_COLUMNS } from "@/models/BoardModel";
import { type Game, type AddGameState } from "@/models/GameModel";
import { useBoard } from "@/providers/BoardProvider";
import { addNewGame } from "@/utils/add";
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
import classes from "./AddGameLibraryTab.module.css";

interface Props {
  state: AddGameState;
  onClose: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

interface Pagination {
  previousOffset: number | undefined;
  nextOffset: number | undefined;
  totalItemCount: number | undefined;
}

type Status = "idle" | "loading" | "completed" | "fetching" | "adding";

const limit = 5;

const AddGameLibraryTab: FC<Props> = (props) => {
  const { state, setLoading } = props;
  const { setColumns } = useBoard();
  const [status, setStatus] = useState<Status>("idle");
  const [titles, setTitles] = useState<TrophyTitle[] | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    previousOffset: undefined,
    nextOffset: undefined,
    totalItemCount: undefined,
  });
  const isLoading = status === "loading";
  const isFetching = status === "fetching";

  const handleAdd = useCallback(
    (title: TrophyTitle) => {
      const payload = {
        code: title.npCommunicationId,
        status: state.status ?? BOARD_COLUMNS.Backlog,
        isFifth: title.trophyTitlePlatform === "PS5",
      };
      setStatus("adding");
      setLoading(true);
      API.post("/games/add/code", JSON.stringify(payload))
        .then((res) => {
          const game: Game = res.data.game;
          addNewGame(game, setColumns);
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
          console.error("add game error", error);
        })
        .finally(() => {
          setStatus("completed");
          setLoading(false);
        });
    },
    [setColumns, setLoading, state.status],
  );

  const fetchTitles = useCallback(() => {
    setStatus("loading");
    setLoading(true);
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
        setLoading(false);
      });
  }, [setLoading]);

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
      {!isLoading && titles != null && (
        <Stack className={classes.list}>
          {titles?.map((title, index) => (
            <LibraryItem
              key={title.trophyTitleName + index}
              item={title}
              handleAdd={handleAdd}
            />
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
