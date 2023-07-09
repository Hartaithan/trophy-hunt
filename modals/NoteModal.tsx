import { type Dispatch, type SetStateAction, type FC, useEffect } from "react";
import { type INoteModalState } from "@/models/NoteModel";
import { Modal, Text } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useGame } from "@/providers/GameProvider";
import PlatformBadge from "@/components/PlatformBadge";
import editorStyles from "@/styles/editor";
import {
  LiftListItemControl,
  SinkListItemControl,
  SplitListItemControl,
  ToggleTaskListControl,
} from "@/components/Controls";

interface INoteModalProps {
  state: INoteModalState;
  setState: Dispatch<SetStateAction<INoteModalState>>;
  initial: INoteModalState;
}

const NoteModal: FC<INoteModalProps> = (props) => {
  const { state, setState, initial } = props;
  const { opened } = state;
  const { game } = useGame();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  const onClose = (): void => {
    setState((prev) => ({ ...prev, opened: false }));
  };

  const onAnimationEnd = (): void => {
    setState(initial);
  };

  useEffect(() => {
    if (editor == null) return;
    editor.commands.setContent(
      '<ul data-type="taskList"><li data-type="taskItem" data-checked="true">A list item</li><li data-type="taskItem" data-checked="false">And another one</li></ul>'
    );
  }, [editor]);

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      onAnimationEnd={onAnimationEnd}
      centered
      size="xl"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title display="flex">
            <Text mr="sm">Note for {game?.title ?? "[Not Found]"}</Text>
            {game != null && <PlatformBadge platform={game.platform} />}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={54}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <ToggleTaskListControl />
                <SplitListItemControl />
                <SinkListItemControl />
                <LiftListItemControl />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </Modal.Body>
      </Modal.Content>
      <style jsx global>
        {editorStyles}
      </style>
    </Modal.Root>
  );
};

export default NoteModal;
