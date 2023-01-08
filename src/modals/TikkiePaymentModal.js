import { InfoCircleIcon } from "assets/icon";
import { Modal } from "components";
import React from "react";

function TikkiePaymentModal({
  openTikkiePaymentModal,
  setOpenTikkiePaymentModal,
}) {
  const handleClose = () => {
    setOpenTikkiePaymentModal(false);
  };

  return (
    <Modal open={openTikkiePaymentModal} onClose={handleClose}>
      <div className="tikkie-payment-modal">
        <div className="icon">
          <InfoCircleIcon />
        </div>
        <div className="title">
          Please complete your payment in the other window just opened and
          return back here.
        </div>
        <div className="actions"></div>
      </div>
    </Modal>
  );
}

export default TikkiePaymentModal;
