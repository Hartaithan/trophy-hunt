"use client";

import { type FC } from "react";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import {
  IconArrowBarBoth,
  IconBrandYoutube,
  IconCheckbox,
  IconIndentDecrease,
  IconIndentIncrease,
  IconPhotoPlus,
} from "@tabler/icons-react";

interface ControlProps {
  onClick: () => void;
}

export const ToggleTaskListControl: FC = () => {
  const { editor } = useRichTextEditorContext();

  const handleToggle = (): void => {
    editor?.commands.toggleTaskList();
  };

  return (
    <RichTextEditor.Control
      onClick={handleToggle}
      active={editor?.isActive("taskList")}
      aria-label="Toggle task list"
      title="Toggle task list">
      <IconCheckbox stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const SplitListItemControl: FC = () => {
  const { editor } = useRichTextEditorContext();

  const handleSplit = (): void => {
    editor?.chain().focus().splitListItem("taskItem").run();
  };

  return (
    <RichTextEditor.Control
      onClick={handleSplit}
      interactive={editor?.can().splitListItem("taskItem")}
      disabled={!(editor?.can().splitListItem("taskItem") ?? false)}
      aria-label="Split list item"
      title="Split list item">
      <IconArrowBarBoth stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const SinkListItemControl: FC = () => {
  const { editor } = useRichTextEditorContext();

  const handleSink = (): void => {
    editor?.chain().focus().sinkListItem("taskItem").run();
  };

  return (
    <RichTextEditor.Control
      onClick={handleSink}
      interactive={editor?.can().sinkListItem("taskItem")}
      disabled={!(editor?.can().sinkListItem("taskItem") ?? false)}
      aria-label="Sink list item"
      title="Sink list item">
      <IconIndentIncrease stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const LiftListItemControl: FC = () => {
  const { editor } = useRichTextEditorContext();

  const handleLift = (): void => {
    editor?.chain().focus().liftListItem("taskItem").run();
  };

  return (
    <RichTextEditor.Control
      onClick={handleLift}
      interactive={editor?.can().liftListItem("taskItem")}
      disabled={!(editor?.can().liftListItem("taskItem") ?? false)}
      aria-label="Lift list item"
      title="Lift list item">
      <IconIndentDecrease stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const ImageControl: FC<ControlProps> = ({ onClick }) => {
  return (
    <RichTextEditor.Control
      onClick={onClick}
      aria-label="Add image"
      title="Add image">
      <IconPhotoPlus stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

export const YoutubeControl: FC<ControlProps> = ({ onClick }) => {
  return (
    <RichTextEditor.Control
      onClick={onClick}
      aria-label="Add youtube video"
      title="Add youtube video">
      <IconBrandYoutube stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};
