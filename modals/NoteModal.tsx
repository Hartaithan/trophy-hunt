import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import {
  type IAddNotePayload,
  type INote,
  type INoteModalState,
} from "@/models/NoteModel";
import {
  Button,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import { useGame } from "@/providers/GameProvider";
import PlatformBadge from "@/components/PlatformBadge";
import editorStyles from "@/styles/editor";
import {
  ImageControl,
  LiftListItemControl,
  SinkListItemControl,
  SplitListItemControl,
  ToggleTaskListControl,
  YoutubeControl,
} from "@/components/Controls";
import API from "@/helpers/api";
import {
  IconAlertCircle,
  IconBookUpload,
  IconCircleCheck,
  IconUpload,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import AddImageDialog from "@/components/AddImageDialog";
import Youtube from "@tiptap/extension-youtube";
import AddYoutubeLinkDialog from "@/components/AddYoutubeLinkDialog";
import { modals } from "@mantine/modals";

interface INoteModalProps {
  state: INoteModalState;
  setState: Dispatch<SetStateAction<INoteModalState>>;
  initial: INoteModalState;
}

type Status =
  | "loading"
  | "completed"
  | "creation"
  | "saving"
  | "saved"
  | "dirty";

const statusIcons: Record<Status, ReactNode> = {
  loading: <Loader size="xs" />,
  completed: undefined,
  creation: <IconBookUpload size={20} />,
  saving: <IconUpload size={20} />,
  saved: undefined,
  dirty: undefined,
};

const statusLabels: Record<Status, string> = {
  loading: "Loading...",
  completed: "Save",
  creation: "Creating...",
  saving: "Saving...",
  saved: "Save",
  dirty: "Save",
};

const statusDisabled: Record<Status, boolean> = {
  loading: true,
  completed: false,
  creation: true,
  saving: true,
  saved: false,
  dirty: false,
};

const NoteModal: FC<INoteModalProps> = (props) => {
  const { state, setState } = props;
  const { opened, game_id, trophy_id } = state;
  const { game } = useGame();
  const { colors } = useMantineTheme();

  const [note, setNote] = useState<INote | null>(null);
  const [addImage, setAddImage] = useState<boolean>(false);
  const [addYoutube, setAddYoutube] = useState<boolean>(false);

  const [status, setStatus] = useState<Status>("loading");
  const isLoading = status === "loading";
  const isSaving = status === "saving";
  const isCreation = status === "creation";
  const isSaved = status === "saved";
  const isDirty = status === "dirty";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TaskList,
      Image,
      Youtube,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: () => {
      setStatus("dirty");
    },
  });

  const onClose = (): void => {
    if (isDirty) {
      modals.openConfirmModal({
        title: "Are you sure?",
        centered: true,
        children: (
          <Text size="sm">Content has been modified but not saved</Text>
        ),
        labels: { confirm: "Close", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onCancel: () => console.info("user cancelled modal close"),
        onConfirm: () => setState((prev) => ({ ...prev, opened: false })),
      });
    } else {
      setState((prev) => ({ ...prev, opened: false }));
    }
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
    setStatus("loading");
    API.get(`/notes?game_id=${game_id}&trophy_id=${trophy_id}`)
      .then(({ data }) => {
        const noteRes: INote | null = data.note ?? null;
        setNoteContent(noteRes);
      })
      .catch((error) => {
        console.error("get note error", game_id, trophy_id, error);
      })
      .finally(() => setStatus("completed"));
  }, [game_id, setNoteContent, trophy_id]);

  const createNewNote = (content: string): void => {
    if (game_id == null || trophy_id == null) return;
    setStatus("creation");
    const payload: IAddNotePayload = {
      game_id,
      trophy_id,
      content,
    };
    API.post(`/notes`, JSON.stringify(payload))
      .then(({ data }) => {
        const noteRes: INote | null = data.note ?? null;
        setNoteContent(noteRes);
        setStatus("saved");
      })
      .catch((error) => {
        console.error("create note error", game_id, trophy_id, error);
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        setStatus("completed");
      });
  };

  const updateNote = (content: string): void => {
    if (note == null) return;
    setStatus("saving");
    const payload: Partial<INote> = {
      content,
    };
    API.put(`/notes/${note.id}`, JSON.stringify(payload))
      .then(({ data }) => {
        const noteRes: INote | null = data.note ?? null;
        setNoteContent(noteRes);
        setStatus("saved");
      })
      .catch((error) => {
        console.error("update note error", game_id, trophy_id, error);
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        setStatus("completed");
      });
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

  const openImageDialog = (): void => {
    setAddImage(true);
  };

  const openYoutubeDialog = (): void => {
    setAddYoutube(true);
  };

  useEffect(() => {
    if (!opened) return;
    reset();
    getNote();
  }, [getNote, opened, reset]);

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      centered
      size={900}
      closeOnClickOutside={!isDirty}
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
            <LoadingOverlay visible={isLoading || isCreation || isSaving} />
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
              <RichTextEditor.ControlsGroup>
                <ImageControl onClick={openImageDialog} />
                <AddImageDialog opened={addImage} setOpened={setAddImage} />
                <YoutubeControl onClick={openYoutubeDialog} />
                <AddYoutubeLinkDialog
                  opened={addYoutube}
                  setOpened={setAddYoutube}
                />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
          <Group mt="md" position="right">
            {isSaved && (
              <Flex align="center">
                <IconCircleCheck size={20} color={colors.green[8]} />
                <Text size="sm" ml={4}>
                  The note is saved.
                </Text>
              </Flex>
            )}
            {isDirty && (
              <Flex align="center">
                <IconAlertCircle size={20} color={colors.yellow[8]} />
                <Text size="sm" ml={4}>
                  Content has been modified.
                </Text>
              </Flex>
            )}
            <Button
              onClick={handleSubmit}
              leftIcon={statusIcons[status]}
              disabled={
                isLoading || (editor?.isEmpty ?? statusDisabled[status])
              }
            >
              {statusLabels[status]}
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
