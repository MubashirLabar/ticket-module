import React from "react";
import { Modal } from "components";

function OtpConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="opt-confirm-modal">
        <img src="/images/optConfirmModalVector.svg" className="vector" />
        <div className="title">Pay later</div>
        <div className="text">
          This option requires you to verify your mobile number via a
          verification code sent your mobile
        </div>
        <div className="actions">
          <div className="action" onClick={onConfirm}>
            OK
          </div>
          <div className="action transparent" onClick={onClose}>
            Cancel
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OtpConfirmModal;
