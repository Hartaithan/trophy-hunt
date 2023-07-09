import { type FC } from "react";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import {
  IconArrowBarBoth,
  IconCheckbox,
  IconIndentDecrease,
  IconIndentIncrease,
} from "@tabler/icons-react";

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
      disabled={!editor.can().liftListItem("taskItem")}
      aria-label="Lift list item"
      title="Lift list item"
    >
      <IconIndentDecrease stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};
