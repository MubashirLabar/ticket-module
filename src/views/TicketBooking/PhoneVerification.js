import React from "react";
import ReactCodeInput from "react-verification-code-input";
function PhoneVerification({
  ticketFields,
  handleSendOtp,
  setPhoneVerified,
  setver_code,
  ver_code,
  handlePayAndVerify,
  setSelectedStep,
}) {
  return (
    <div className="phone-verification">
      <div className="section">
        <div className="block">
          <div className="meta">
            <div className="title">Verify Phone Number</div>
            <div className="text">
              Please enter the 4 digit code sent to{" "}
              <span>+{ticketFields?.username}</span> through SMS
            </div>
          </div>
          <ReactCodeInput
            fields={4}
            onComplete={(e) => {
              handlePayAndVerify(`${e}`);
            }}
            className="react-code-input"
          />
          <label className="resent-blk">
            Didn’t recieve a code?{" "}
            <span onClick={() => handleSendOtp()}>Resend SMS</span>
          </label>
          {/* <div
            onClick={() => {
              setSelectedStep(2);
            }}
            className="error-msg"
          >
            Wrong number
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PhoneVerification;
