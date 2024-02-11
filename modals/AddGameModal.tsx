"use client";

import ColumnBadge from "@/components/ColumnBadge/ColumnBadge";
import { type AddGameState } from "@/models/GameModel";
import { Modal, LoadingOverlay, Tabs } from "@mantine/core";
import { type FC, type Dispatch, type SetStateAction, useState } from "react";
import AddGameSearchTab from "@/tabs/AddGameSearchTab/AddGameSearchTab";
import AddGameCodeTab from "@/tabs/AddGameCodeTab/AddGameCodeTab";
import AddGameLibraryTab from "@/tabs/AddGameLibraryTab/AddGameLibraryTab";

interface Props {
  state: AddGameState;
  setState: Dispatch<SetStateAction<AddGameState>>;
  initial: AddGameState;
}

const AddGameModal: FC<Props> = (props) => {
  const { state, setState, initial } = props;
  const { opened, status } = state;
  const [isSubmit, setSubmit] = useState<boolean>(false);

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
      centered>
      <Modal.Overlay />
      <Modal.Content>
        <LoadingOverlay visible={isSubmit} zIndex={1001} />
        <Modal.Header>
          <Modal.Title>
            Add the game to the&nbsp;
            <ColumnBadge status={status} />
            &nbsp;column
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultValue="search">
            <Tabs.List mb="md">
              <Tabs.Tab value="search">Search</Tabs.Tab>
              <Tabs.Tab value="library">Library</Tabs.Tab>
              <Tabs.Tab value="code">Manual</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="search">
              <AddGameSearchTab
                state={state}
                onClose={onClose}
                setSubmit={setSubmit}
              />
            </Tabs.Panel>
            <Tabs.Panel value="library">
              <AddGameLibraryTab
                state={state}
                onClose={onClose}
                setSubmit={setSubmit}
              />
            </Tabs.Panel>
            <Tabs.Panel value="code">
              <AddGameCodeTab
                state={state}
                onClose={onClose}
                setSubmit={setSubmit}
              />
            </Tabs.Panel>
          </Tabs>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AddGameModal;
