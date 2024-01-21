"use client";

import { BOARD_COLUMNS } from "@/models/BoardModel";
import { type AddGameCodePayload, type AddGameState } from "@/models/GameModel";
import { Button, Checkbox, TextInput, useMantineTheme } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { IconSquarePlus } from "@tabler/icons-react";
import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useCallback,
  useEffect,
} from "react";

interface Props {
  state: AddGameState;
  onClose: () => void;
  setSubmit: Dispatch<SetStateAction<boolean>>;
}

const AddGameCodeTab: FC<Props> = (props) => {
  const { state, onClose, setSubmit } = props;
  const { opened, status } = state;
  const { spacing } = useMantineTheme();

  const form = useForm<AddGameCodePayload>({
    initialValues: {
      code: "",
      status: status ?? BOARD_COLUMNS.Backlog,
      isFifth: true,
    },
    validate: {
      code: hasLength(12, "Code must be 12 characters long"),
    },
    validateInputOnChange: true,
  });

  const handleReset = useCallback((): void => {
    setSubmit(false);
  }, [setSubmit]);

  const handleSubmit = (values: typeof form.values): void => {
    console.info("submit", values);
    onClose();
  };

  useEffect(() => {
    if (!opened) return;
    handleReset();
  }, [handleReset, opened]);

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
