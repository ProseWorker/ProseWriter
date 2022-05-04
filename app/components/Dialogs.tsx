import { observer } from "mobx-react-lite";
import * as React from "react";
import Guide from "~/components/Guide";
import Modal from "~/components/Modal";
import useStores from "~/hooks/useStores";

function Dialogs() {
  const { dialogs } = useStores();
  const { guide, modalStack } = dialogs;
  return (
    <>
      {guide ? (
        <Guide
          isOpen={guide.isOpen}
          onRequestClose={dialogs.closeGuide}
          title={guide.title}
        >
          {guide.content}
        </Guide>
      ) : undefined}
      {[...modalStack].map(([id, modal]) => (
        <Modal
          key={id}
          isOpen={modal.isOpen}
          isCentered={modal.isCentered}
          onRequestClose={() => dialogs.closeModal(id)}
          title={modal.title}
        >
          {modal.content}
        </Modal>
      ))}
    </>
  );
}

export default observer(Dialogs);
