import API from "@/api/API";
import { columnColors, columnsLabels } from "@/constants/board";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import { type ISearchResult } from "@/models/SearchModel";
import {
  Modal,
  Badge,
  createStyles,
  Loader,
  Button,
  useMantineTheme,
  Select,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useState, type FC, useEffect } from "react";

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

const useStyles = createStyles(({ colors }, { status }: IAddGameModalProps) => {
  const { color, shade } = columnColors[status ?? "backlog"];
  return {
    status: {
      background: colors[color][shade] + "80",
      color: colors.gray[0],
    },
  };
});

const AddGameModal: FC<IAddGameModalProps> = (props) => {
  const { status, opened, close } = props;
  const { classes } = useStyles(props);
  const { spacing } = useMantineTheme();

  const [search, setSearch] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const data = results.map((item) => ({
    label: `${item.name} [${item.platform}]`,
    value: item.url,
  }));

  const handleReset = (): void => {
    setSearch("");
    setLoading(false);
    setResults([]);
  };

  const handleSearch = (value: string): void => {
    setSearch(value);
    const isValid = isValidSearch(value);
    if (!isValid) return;
    setLoading(true);
  };

  const handleSubmit = (): void => {
    alert(value);
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
    if (opened) {
      handleReset();
    }
  }, [opened]);

  return (
    <Modal.Root opened={opened} onClose={close} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            Add the game to the&nbsp;
            <Badge className={classes.status} radius="sm">
              {status !== null ? columnsLabels[status] : "Not Found"}
            </Badge>
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
            withinPortal
            placeholder="Search..."
            maxDropdownHeight={300}
            onSearchChange={handleSearch}
            rightSection={isLoading ? <Loader size="xs" /> : null}
          />
          <Button mt={spacing.md} fullWidth onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AddGameModal;
