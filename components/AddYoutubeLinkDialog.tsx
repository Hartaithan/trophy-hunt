import { type IModalProps } from "@/models/ModalModel";
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

const AddYoutubeLinkDialog: FC<IModalProps> = (props) => {
  const { opened, setOpened } = props;
  const { editor } = useRichTextEditorContext();

  const form = useForm({
    initialValues: { url: "" },
    validate: {
      url: matches(
        // eslint-disable-next-line no-useless-escape
        /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/,
        "Enter a valid youtube url"
      ),
    },
  });

  const handleSubmit = (values: TransformedValues<typeof form>): void => {
    editor.commands.setYoutubeVideo({
      src: values.url,
      width: 640,
      height: 480,
    });
    form.reset();
    setOpened(false);
  };

  return (
    <Dialog
      opened={opened}
      withCloseButton
      position={centeredDialog as DialogProps["position"]}
      onClose={() => setOpened(false)}
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
        <Button
          onClick={() => form.onSubmit(handleSubmit)()}
          sx={{ alignSelf: "flex-start" }}
        >
          Add
        </Button>
      </Group>
    </Dialog>
  );
};

export default memo(AddYoutubeLinkDialog);
