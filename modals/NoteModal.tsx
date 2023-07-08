import { type INoteModalState } from "@/models/NoteModel";
import { Text, Modal } from "@mantine/core";
import { type Dispatch, type SetStateAction, type FC } from "react";

interface INoteModalProps {
  state: INoteModalState;
  setState: Dispatch<SetStateAction<INoteModalState>>;
  initial: INoteModalState;
}

const NoteModal: FC<INoteModalProps> = (props) => {
  const { state, setState, initial } = props;
  const { opened } = state;

  const onClose = (): void => {
    setState((prev) => ({ ...prev, opened: false }));
  };

  const onAnimationEnd = (): void => {
    setState(initial);
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      onAnimationEnd={onAnimationEnd}
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Title</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Text>NoteModal</Text>
          <Text component="pre">{JSON.stringify(state, null, 2)}</Text>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default NoteModal;
