"use client";

import { BOARD_COLUMNS } from "@/models/BoardModel";
import {
  type Game,
  type AddGameCodePayload,
  type AddGameState,
} from "@/models/GameModel";
import { useBoard } from "@/providers/BoardProvider";
import { addNewGame, validateGameCode } from "@/utils/add";
import API from "@/utils/api";
import { Button, Checkbox, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSquarePlus } from "@tabler/icons-react";
import { type Dispatch, type SetStateAction, type FC, useEffect } from "react";

interface Props {
  state: AddGameState;
  onClose: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const AddGameCodeTab: FC<Props> = (props) => {
  const { state, onClose, setLoading } = props;
  const { opened, status } = state;
  const { spacing } = useMantineTheme();
  const { setColumns } = useBoard();

  const form = useForm<AddGameCodePayload>({
    initialValues: {
      code: "",
      status: status ?? BOARD_COLUMNS.Backlog,
      isFifth: true,
    },
    validate: {
      code: validateGameCode,
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values): void => {
    setLoading(true);
    API.post("/games/add/code", JSON.stringify(values))
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
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!opened) return;
    setLoading(false);
  }, [setLoading, opened]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput placeholder="Enter code..." {...form.getInputProps("code")} />
      <Checkbox
        mt="md"
        defaultChecked
        label="PlayStation 5"
        {...form.getInputProps("isFifth")}
      />
      <Button
        fullWidth
        type="submit"
        mt={spacing.md}
        disabled={!form.isValid() || status === null}
        leftSection={<IconSquarePlus size={20} />}>
        Add
      </Button>
    </form>
  );
};

export default AddGameCodeTab;
