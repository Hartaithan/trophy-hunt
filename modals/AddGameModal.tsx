import { type BOARD_COLUMNS } from "@/models/BoardModel";
import { Text, Modal } from "@mantine/core";
import { type FC } from "react";

interface IAddGameModalProps {
  status: BOARD_COLUMNS | null;
  opened: boolean;
  close: () => void;
}

const AddGameModal: FC<IAddGameModalProps> = (props) => {
  const { status, opened, close } = props;
  return (
    <Modal.Root opened={opened} onClose={close}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Add the game to the {status} column</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Text>Status: {status}</Text>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AddGameModal;
