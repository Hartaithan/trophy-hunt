"use client";

import ColumnBadge from "@/components/ColumnBadge/ColumnBadge";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  type Game,
  type AddGamePayload,
  type ReorderItem,
  type AddGameState,
} from "@/models/GameModel";
import { type SearchResult } from "@/models/SearchModel";
import { useBoard } from "@/providers/BoardProvider";
import {
  Modal,
  Loader,
  Button,
  useMantineTheme,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  useState,
  type FC,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  IconAlertOctagon,
  IconCheck,
  IconSquarePlus,
} from "@tabler/icons-react";
import API from "@/utils/api";

interface AddGameModalProps {
  state: AddGameState;
  setState: Dispatch<SetStateAction<AddGameState>>;
  initial: AddGameState;
}

const isValidSearch = (value: string): boolean => {
  const isEmpty = value.trim().length === 0;
  const hasTags = value.includes("[");
  return !isEmpty && !hasTags;
};

const AddGameModal: FC<AddGameModalProps> = (props) => {
  const { state, setState, initial } = props;
  const { opened, status } = state;
  const { spacing } = useMantineTheme();
  const { setColumns } = useBoard();

  const [search, setSearch] = useState<string>("");
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const data = results.map((item) => ({
    label: `${item.name} [${item.platform}]`,
    value: item.url,
  }));
  const showNoResults = search.trim().length === 0 || isLoading;

  const handleReset = (): void => {
    setSearch("");
    setSubmit(false);
    setValue(null);
    setLoading(false);
    setResults([]);
  };

  const handleSearch = (value: string): void => {
    setSearch(value);
    const isValid = isValidSearch(value);
    setLoading(isValid);
  };

  const onClose = (): void => {
    setState((prev) => ({ ...prev, opened: false }));
  };

  const onAnimationEnd = (): void => {
    setState(initial);
  };

  const addNewGame = (game: Game): void => {
    const status: BOARD_COLUMNS | null = game?.status ?? null;
    if (status == null) return;
    setColumns((items) => {
      const newItems = [game, ...items[status]];
      const reorderItems: ReorderItem[] = newItems.map((i, index) => ({
        id: i.id,
        position: index,
        status: i.status,
      }));
      const payload = { items: reorderItems };
      notifications.show({
        id: "reorder",
        loading: true,
        title: "Sync...",
        message:
          "Synchronizing the order of games... It shouldn't take long, don't reload the page.",
        autoClose: false,
        withCloseButton: false,
      });
      API.post("/games/reorder", JSON.stringify(payload))
        .then((res) => {
          notifications.update({
            id: "reorder",
            loading: false,
            title: "Success!",
            message: res.data.message,
            icon: <IconCheck size="1rem" />,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          notifications.update({
            id: "reorder",
            loading: false,
            color: "red",
            title: "Something went wrong!",
            message:
              "For some reason the synchronization did not complete, please try again.",
            icon: <IconAlertOctagon size="1rem" />,
            withCloseButton: true,
          });
          console.error("reorder columns error", error);
        });
      return {
        ...items,
        [status]: newItems,
      };
    });
  };

  const handleSubmit = (): void => {
    const payload: Partial<AddGamePayload> = {
      game_id: value ?? undefined,
      status: status ?? undefined,
    };
    setSubmit(true);
    API.post("/games/add", JSON.stringify(payload))
      .then((res) => {
        const game: Game = res.data.game;
        addNewGame(game);
        notifications.show({
          title: "Success!",
          message: res.data.message,
          autoClose: 3000,
        });
        onClose();
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
        setSubmit(false);
      });
  };

  useEffect(() => {
    const isValid = isValidSearch(debouncedSearch);
    if (!isValid) return;
    setLoading(true);
    API.get("/games/search?query=" + debouncedSearch)
      .then((res) => {
        const response = res.data?.results ?? [];
        setResults(response);
      })
      .catch((error) => {
        console.error("search error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedSearch]);

  useEffect(() => {
    if (!opened) return;
    handleReset();
  }, [opened]);

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      onAnimationEnd={onAnimationEnd}
      centered>
      <Modal.Overlay />
      <Modal.Content>
        <LoadingOverlay visible={isSubmit} zIndex={1001} />
        <Modal.Header>
          <Modal.Title>
            Add the game to the&nbsp;
            <ColumnBadge status={status} />
            &nbsp;column
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Select
            searchable
            value={value}
            onChange={setValue}
            data={data}
            placeholder="Search..."
            maxDropdownHeight={300}
            searchValue={search}
            onSearchChange={handleSearch}
            comboboxProps={{ withinPortal: true }}
            rightSection={isLoading ? <Loader size="xs" /> : null}
            nothingFoundMessage={showNoResults ? undefined : "No results"}
          />
          <Button
            mt={spacing.md}
            fullWidth
            disabled={value === null || status === null}
            onClick={handleSubmit}
            leftSection={<IconSquarePlus size={20} />}>
            Add
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AddGameModal;
