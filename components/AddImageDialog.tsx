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
import {
  type Dispatch,
  type SetStateAction,
  type FC,
  memo,
  type CSSProperties,
} from "react";

interface IAddImageDialogProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

interface ICustomPosition {
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
  transform: CSSProperties["transform"];
}

const position: ICustomPosition = {
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
};

const AddImageDialog: FC<IAddImageDialogProps> = (props) => {
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
    setOpened(false);
  };

  return (
    <Dialog
      opened={opened}
      withCloseButton
      position={position as DialogProps["position"]}
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
