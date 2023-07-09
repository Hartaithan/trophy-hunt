import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useEffect,
  useCallback,
  useState,
} from "react";
import {
  type IAddNotePayload,
  type INote,
  type INoteModalState,
} from "@/models/NoteModel";
import { Button, Group, LoadingOverlay, Modal, Text } from "@mantine/core";
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
import API from "@/helpers/api";

interface INoteModalProps {
  state: INoteModalState;
  setState: Dispatch<SetStateAction<INoteModalState>>;
  initial: INoteModalState;
}

const NoteModal: FC<INoteModalProps> = (props) => {
  const { state, setState } = props;
  const { opened, game_id, trophy_id } = state;
  const { game } = useGame();

  const [note, setNote] = useState<INote | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

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

  const reset = useCallback((): void => {
    setNote(null);
    if (editor == null) return;
    editor.commands.setContent("");
  }, [editor]);

  const setNoteContent = useCallback(
    (response: INote | null): void => {
      if (response == null) return;
      setNote(response);
      if (editor != null) {
        editor.commands.setContent(response.content);
      } else {
        console.error("editor not ready");
      }
    },
    [editor]
  );

  const getNote = useCallback(() => {
    if (game_id == null || trophy_id == null) return;
    setLoading(true);
    API.get(`/notes?game_id=${game_id}&trophy_id=${trophy_id}`)
      .then(({ data }) => {
        const noteRes: INote | null = data.note ?? null;
        setNoteContent(noteRes);
      })
      .catch((error) => {
        console.error("get note error", game_id, trophy_id, error);
      })
      .finally(() => setLoading(false));
  }, [game_id, setNoteContent, trophy_id]);

  const createNewNote = (content: string): void => {
    if (game_id == null || trophy_id == null) return;
    const payload: IAddNotePayload = {
      game_id,
      trophy_id,
      content,
    };
    API.post(`/notes`, JSON.stringify(payload))
      .then(({ data }) => {
        const noteRes: INote | null = data.note ?? null;
        setNoteContent(noteRes);
      })
      .catch((error) => {
        console.error("create note error", game_id, trophy_id, error);
      })
      .finally(() => setLoading(false));
  };

  const updateNote = (content: string): void => {
    if (note == null) return;
    const payload: Partial<INote> = {
      content,
    };
    API.put(`/notes/${note.id}`, JSON.stringify(payload))
      .then(({ data }) => {
        const noteRes: INote | null = data.note ?? null;
        setNoteContent(noteRes);
      })
      .catch((error) => {
        console.error("update note error", game_id, trophy_id, error);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (): void => {
    if (editor == null) return;
    const content = editor.getHTML();
    if (note != null) {
      updateNote(content);
    } else {
      createNewNote(content);
    }
  };

  useEffect(() => {
    if (!opened) return;
    reset();
    getNote();
  }, [getNote, opened, reset]);

  return (
    <Modal.Root opened={opened} onClose={onClose} centered size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title display="flex">
            <Text mr="sm">
              Note for {game?.title ?? "[Not Found]"} G:{game_id} T:{trophy_id}
            </Text>
            {game != null && <PlatformBadge platform={game.platform} />}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <LoadingOverlay visible={isLoading} zIndex={9999} />
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
          <Group mt="md" position="right">
            <Button
              onClick={() => handleSubmit()}
              disabled={editor?.isEmpty ?? true}
            >
              Save
            </Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
      <style jsx global>
        {editorStyles}
      </style>
    </Modal.Root>
  );
};

export default NoteModal;
