import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function StepTwo({ ticketFields, setTicketFields }) {
  return (
    <div className="ticket-booking_step-two">
      <div className="section">
        <div className="block personal-info">
          <div className="field-control">
            <div className="field-lbl">
              Full Name <span className="star">*</span>
            </div>
            <div className="field">
              <input
                type="text"
                className="input"
                value={ticketFields.fullName}
                onChange={(e) =>
                  setTicketFields({ ...ticketFields, fullName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="field-control">
            <div className="field-lbl">
              Email <span className="star">*</span>
            </div>
            <div className="field">
              <input
                type="email"
                className="input"
                value={ticketFields.email}
                onChange={(e) =>
                  setTicketFields({ ...ticketFields, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="field-control">
            <div className="field-lbl">
              Phone number <span className="star">*</span>
            </div>
            <PhoneInput
              country={"nl"}
              value={ticketFields.username}
              onChange={(phone) => {
                setTicketFields({ ...ticketFields, username: phone });
              }}
            />
            <div className="msg">
              we will verify your entered phone number by sms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepTwo;
