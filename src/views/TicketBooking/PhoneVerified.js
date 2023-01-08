import { CheckIcon } from "assets/icon";
import React from "react";

function PhoneVerified({ticketFields}) {
  return (
    <div className="phone-verified">
      <div className="section">
        <div className="phone">+{ticketFields.username} </div>
        <div className="title"> Mobile Number Verfied</div>
        <div className="success-icon">
          <CheckIcon />
        </div>
      </div>
    </div>
  );
}

export default PhoneVerified;
