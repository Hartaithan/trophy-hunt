"use client";

import {
  type AddGameState,
  type AddGameSearchPayload,
  type Game,
} from "@/models/GameModel";
import { type SearchResult } from "@/models/SearchModel";
import { useBoard } from "@/providers/BoardProvider";
import { addNewGame } from "@/utils/add";
import API from "@/utils/api";
import {
  Anchor,
  Button,
  Input,
  Loader,
  Select,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSquarePlus } from "@tabler/icons-react";
import {
  Fragment,
  type FC,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useCallback,
} from "react";

interface Props {
  state: AddGameState;
  onClose: () => void;
  setSubmit: Dispatch<SetStateAction<boolean>>;
}

const isValidSearch = (value: string): boolean => {
  const isEmpty = value.trim().length === 0;
  const hasTags = value.includes("[");
  return !isEmpty && !hasTags;
};

const AddGameSearchTab: FC<Props> = (props) => {
  const { state, onClose, setSubmit } = props;
  const { opened, status } = state;
  const { spacing } = useMantineTheme();
  const { setColumns } = useBoard();

  const [search, setSearch] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const data = results.map((item) => ({
    label: `${item.name} [${item.platform}]`,
    value: item.url,
  }));
  const showNoResults = search.trim().length === 0 || isLoading;

  const handleReset = useCallback((): void => {
    setSearch("");
    setSubmit(false);
    setValue(null);
    setLoading(false);
    setResults([]);
  }, [setSubmit]);

  const handleSearch = (value: string): void => {
    setSearch(value);
    const isValid = isValidSearch(value);
    setLoading(isValid);
  };

  const handleSubmit = (): void => {
    const payload: Partial<AddGameSearchPayload> = {
      game_id: value ?? undefined,
      status: status ?? undefined,
    };
    setSubmit(true);
    API.post("/games/add/search", JSON.stringify(payload))
      .then((res) => {
        const game: Game = res.data.game;
        addNewGame(game, setColumns);
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
  }, [handleReset, opened]);

  return (
    <Fragment>
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
      <Input.Description mt="xs">
        Search powered by&nbsp;
        <Anchor size="xs" href="https://www.stratege.ru" target="_blank">
          Stratege
        </Anchor>
      </Input.Description>
      <Button
        mt={spacing.md}
        fullWidth
        disabled={value === null || status === null}
        onClick={handleSubmit}
        leftSection={<IconSquarePlus size={20} />}>
        Add
      </Button>
    </Fragment>
  );
};

export default AddGameSearchTab;
