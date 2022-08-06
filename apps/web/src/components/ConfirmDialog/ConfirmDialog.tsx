import React from "react";

import { Button, Modal } from "@wishlify/ui";

import { useConfirm } from "use-confirm";

export const ConfirmDialog: React.FC = () => {
  const { isAsking, message, buttonsText, deny, confirm } = useConfirm();

  return (
    <Modal isOpen={isAsking} onClose={deny} className="w-[90%] sm:w-[450px]">
      <h2 className="mt-4 text-lg text-center dark:text-white/90">{message}</h2>
      <div className="mt-6 flex gap-2">
        <Button
          className="flex-grow"
          size="large"
          variant="outlined"
          color="gray"
          onClick={deny}
        >
          {buttonsText.no}
        </Button>
        <Button
          className="flex-grow"
          size="large"
          variant="primary"
          onClick={confirm}
        >
          {buttonsText.yes}
        </Button>
      </div>
    </Modal>
  );
};
