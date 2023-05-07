import ColumnBadge from "@/components/ColumnBadge";
import API from "@/helpers/api";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  type IGame,
  type IAddGamePayload,
  type IReorderItem,
} from "@/models/GameModel";
import { type ISearchResult } from "@/models/SearchModel";
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
import { useState, type FC, useEffect } from "react";
import { AlertOctagon, Check, SquarePlus } from "tabler-icons-react";

interface IAddGameModalProps {
  status: BOARD_COLUMNS | null;
  opened: boolean;
  close: () => void;
}

const isValidSearch = (value: string): boolean => {
  const isEmpty = value.trim().length === 0;
  const hasTags = value.includes("[");
  return !isEmpty && !hasTags;
};

const AddGameModal: FC<IAddGameModalProps> = (props) => {
  const { status, opened, close } = props;
  const { spacing } = useMantineTheme();
  const { setColumns } = useBoard();

  const [search, setSearch] = useState<string>("");
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ISearchResult[]>([]);
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

  const addNewGame = (game: IGame): void => {
    const status: BOARD_COLUMNS | null = game?.status ?? null;
    if (status == null) return;
    setColumns((items) => {
      const newItems = [game, ...items[status]];
      const reorderItems: IReorderItem[] = newItems.map((i, index) => ({
        id: i.id,
        order_index: index,
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
            title: "Success!",
            message: res.data.message,
            icon: <Check size="1rem" />,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          notifications.update({
            id: "reorder",
            color: "red",
            title: "Something went wrong!",
            message:
              "For some reason the synchronization did not complete, please try again.",
            icon: <AlertOctagon size="1rem" />,
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
    const payload: Partial<IAddGamePayload> = {
      gameId: value ?? undefined,
      status: status ?? undefined,
    };
    setSubmit(true);
    API.post("/games/add", JSON.stringify(payload))
      .then((res) => {
        const game: IGame = res.data.game;
        addNewGame(game);
        notifications.show({
          title: "Success!",
          message: res.data.message,
          autoClose: 3000,
        });
        close();
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
      .finally(() => setSubmit(false));
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
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  useEffect(() => {
    if (!opened) return;
    handleReset();
  }, [opened]);

  return (
    <Modal.Root opened={opened} onClose={close} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            Add the game to the&nbsp;
            <ColumnBadge status={status} />
            &nbsp;column
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <LoadingOverlay visible={isSubmit} />
          <Select
            searchable
            value={value}
            onChange={setValue}
            data={data}
            withinPortal
            placeholder="Search..."
            maxDropdownHeight={300}
            searchValue={search}
            onSearchChange={handleSearch}
            rightSection={isLoading ? <Loader size="xs" /> : null}
            nothingFound={showNoResults ? undefined : "No results"}
          />
          <Button
            mt={spacing.md}
            fullWidth
            disabled={value === null || status === null}
            onClick={handleSubmit}
            leftIcon={<SquarePlus size={20} />}
          >
            Add
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AddGameModal;
