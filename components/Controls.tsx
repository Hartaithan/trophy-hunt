import { type FC } from "react";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import {
  IconArrowBarBoth,
  IconCheckbox,
  IconIndentDecrease,
  IconIndentIncrease,
  IconPhotoPlus,
} from "@tabler/icons-react";

interface IImageControlProps {
  onClick: () => void;
}

export const ToggleTaskListControl: FC = () => {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor.commands.toggleTaskList()}
      active={editor.isActive("taskList")}
      aria-label="Toggle task list"
      title="Toggle task list"
    >
      <IconCheckbox stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const SplitListItemControl: FC = () => {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor.chain().focus().splitListItem("taskItem").run()}
      interactive={editor.can().splitListItem("taskItem")}
      disabled={!editor.can().splitListItem("taskItem")}
      aria-label="Split list item"
      title="Split list item"
    >
      <IconArrowBarBoth stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const SinkListItemControl: FC = () => {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor.chain().focus().sinkListItem("taskItem").run()}
      interactive={editor.can().sinkListItem("taskItem")}
      disabled={!editor.can().sinkListItem("taskItem")}
      aria-label="Sink list item"
      title="Sink list item"
    >
      <IconIndentIncrease stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const LiftListItemControl: FC = () => {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor.chain().focus().liftListItem("taskItem").run()}
      interactive={editor.can().liftListItem("taskItem")}
      disabled={!editor.can().liftListItem("taskItem")}
      aria-label="Lift list item"
      title="Lift list item"
    >
      <IconIndentDecrease stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const ImageControl: FC<IImageControlProps> = ({ onClick }) => {
  return (
    <RichTextEditor.Control
      onClick={onClick}
      aria-label="Add image"
      title="Add image"
    >
      <IconPhotoPlus stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};
