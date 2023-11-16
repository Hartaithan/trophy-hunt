"use client";

import { imageUrlRegex } from "@/constants/regex";
import { type ModalProps } from "@/models/ModalModel";
import { centeredDialog } from "@/styles/theme";
import {
  Button,
  Text,
  TextInput,
  Dialog,
  Group,
  type DialogProps,
} from "@mantine/core";
import { type TransformedValues, matches, useForm } from "@mantine/form";
import { useRichTextEditorContext } from "@mantine/tiptap";
import { type FC, memo } from "react";

const AddImageDialog: FC<ModalProps> = (props) => {
  const { opened, setOpened } = props;
  const { editor } = useRichTextEditorContext();

  const form = useForm({
    initialValues: { image_url: "" },
    validate: {
      image_url: matches(imageUrlRegex, "Enter a valid image url"),
    },
  });

  const handleClose = (): void => {
    setOpened(false);
  };

  const submitImage = (values: TransformedValues<typeof form>): void => {
    if (editor == null) return;
    editor.chain().focus().setImage({ src: values.image_url }).run();
    form.reset();
    setOpened(false);
  };

  const handleSubmit = (): void => {
    form.onSubmit(submitImage)();
  };

  return (
    <Dialog
      opened={opened}
      withCloseButton
      position={centeredDialog as DialogProps["position"]}
      onClose={handleClose}
      size="lg"
      radius="md"
      zIndex={9999}>
      <Text size="sm" mb="xs" fw={500}>
        Add image link
      </Text>
      <Group align="flex-end">
        <TextInput
          {...form.getInputProps("image_url")}
          placeholder="https://example.com/image.png"
          style={{ flex: 1 }}
        />
        <Button onClick={handleSubmit} style={{ alignSelf: "flex-start" }}>
          Add
        </Button>
      </Group>
    </Dialog>
  );
};

export default memo(AddImageDialog);
