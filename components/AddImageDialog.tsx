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

const AddImageDialog: FC<IModalProps> = (props) => {
  const { opened, setOpened } = props;
  const { editor } = useRichTextEditorContext();

  const form = useForm({
    initialValues: { image_url: "" },
    validate: {
      image_url: matches(
        /^(http(s?):)([/|.|\w|\s|-])*\.(?:png|gif|webp|jpeg|jpg)$/,
        "Enter a valid image url"
      ),
    },
  });

  const handleSubmit = (values: TransformedValues<typeof form>): void => {
    editor.chain().focus().setImage({ src: values.image_url }).run();
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
        Add image link
      </Text>
      <Group align="flex-end">
        <TextInput
          {...form.getInputProps("image_url")}
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

export default memo(AddImageDialog);
