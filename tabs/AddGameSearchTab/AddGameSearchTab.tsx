"use client";

import {
  type AddGameState,
  type AddGameSearchPayload,
  type Game,
} from "@/models/GameModel";
import { type RegionsResult } from "@/models/RegionModel";
import { type SearchResult } from "@/models/SearchModel";
import { useBoard } from "@/providers/BoardProvider";
import { addNewGame } from "@/utils/add";
import API from "@/utils/api";
import { splitSearchResult } from "@/utils/search";
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
  useMemo,
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

const defaultPayload: AddGameSearchPayload = {
  id: null,
  status: null,
  platform: null,
};

const AddGameSearchTab: FC<Props> = (props) => {
  const { state, onClose, setSubmit } = props;
  const { opened, status } = state;
  const { spacing } = useMantineTheme();
  const { setColumns } = useBoard();

  const [search, setSearch] = useState<string>("");
  const [payload, setPayload] = useState<AddGameSearchPayload>({
    id: null,
    status: null,
    platform: null,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [regions, setRegions] = useState<RegionsResult[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleReset = useCallback((): void => {
    setSearch("");
    setSubmit(false);
    setPayload(defaultPayload);
    setLoading(false);
    setResults([]);
  }, [setSubmit]);

  const handleSearch = useCallback((value: string): void => {
    setSearch(value);
    const isValid = isValidSearch(value);
    setLoading(isValid);
  }, []);

  const handleChange = useCallback((value: string | null) => {
    const { platform, hash } = splitSearchResult(value);
    setPayload((prev) => ({ ...prev, platform, result: value }));
    if (hash == null) return;
    API.get(`/games/regions?hash=${hash}`)
      .then(({ data }) => {
        const regionsRes = data?.results ?? [];
        setRegions(regionsRes);
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("unable to get game regions error", error);
      });
  }, []);

  const handleRegionChange = useCallback((value: string | null) => {
    setPayload((prev) => ({ ...prev, id: value }));
  }, []);

  const handleSubmit = useCallback((): void => {
    const searchPayload: Partial<AddGameSearchPayload> = {
      id: payload.id ?? undefined,
      platform: payload.platform ?? undefined,
      status: status ?? undefined,
    };
    setSubmit(true);
    API.post("/games/add/search", JSON.stringify(searchPayload))
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
  }, [onClose, setColumns, setSubmit, status, payload]);

  // TODO: format before setting this in state
  const formattedResults = useMemo(() => {
    return results.map((item) => ({
      label: `${item.name} [${item.platform}]`,
      value: item.value,
    }));
  }, [results]);

  // TODO: format before setting this in state
  const formattedRegions = useMemo(() => {
    return regions.map((item) => ({
      label: `${item.title} [${item.platform}]`,
      value: item.id.toString(),
    }));
  }, [regions]);

  const showNoResults = useMemo(() => {
    return search.trim().length === 0 || isLoading;
  }, [isLoading, search]);

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
        value={payload.result}
        onChange={handleChange}
        data={formattedResults}
        placeholder="Search"
        maxDropdownHeight={300}
        searchValue={search}
        onSearchChange={handleSearch}
        comboboxProps={{ withinPortal: true }}
        rightSection={isLoading ? <Loader size="xs" /> : null}
        nothingFoundMessage={showNoResults ? undefined : "No results"}
      />
      {/* TODO: add loader */}
      {/* TODO: add change handlers */}
      <Select
        mt="xs"
        placeholder="Region"
        value={payload.id}
        onChange={handleRegionChange}
        data={formattedRegions}
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
        // TODO: improve validation
        disabled={
          payload.id === null || payload.platform === null || status === null
        }
        onClick={handleSubmit}
        leftSection={<IconSquarePlus size={20} />}>
        Add
      </Button>
    </Fragment>
  );
};

export default AddGameSearchTab;
