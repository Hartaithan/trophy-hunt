import { type ModalProps } from "@/models/ModalModel";
import { centeredDialog } from "@/styles/global";
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

const isYoutubeLink =
  /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w-_]+)/gim;

const AddYoutubeLinkDialog: FC<ModalProps> = (props) => {
  const { opened, setOpened } = props;
  const { editor } = useRichTextEditorContext();

  const form = useForm({
    initialValues: { url: "" },
    validate: {
      url: matches(isYoutubeLink, "Enter a valid youtube url"),
    },
  });

  const handleClose = (): void => {
    setOpened(false);
  };

  const submitLink = (values: TransformedValues<typeof form>): void => {
    editor.commands.setYoutubeVideo({
      src: values.url,
      width: 640,
      height: 480,
    });
    form.reset();
    setOpened(false);
  };

  const handleSubmit = (): void => {
    form.onSubmit(submitLink)();
  };

  return (
    <Dialog
      opened={opened}
      withCloseButton
      position={centeredDialog as DialogProps["position"]}
      onClose={handleClose}
      size="lg"
      radius="md"
      zIndex={9999}
    >
      <Text size="sm" mb="xs" weight={500}>
        Add youtube link
      </Text>
      <Group align="flex-end">
        <TextInput
          {...form.getInputProps("url")}
          placeholder="https://example.com/image.png"
          sx={{ flex: 1 }}
        />
        <Button onClick={handleSubmit} sx={{ alignSelf: "flex-start" }}>
          Add
        </Button>
      </Group>
    </Dialog>
  );
};

export default memo(AddYoutubeLinkDialog);
