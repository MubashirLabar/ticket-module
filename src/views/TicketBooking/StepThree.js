import React, { useEffect, useState } from "react";
import {
  AppleIcon,
  GoogleIcon,
  LocationIcon,
  TikkieIcon,
  TimerIcon,
  CardIcon,
  PayIcon,
  ArrowRightIcon,
} from "assets/icon";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetPaymentProfileQuery,
  useGetTicketsInfoQuery,
} from "store/services/ticketServices";
import { Loader, LoadingOverlay } from "components";
function StepThree({
  ticketdata,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  totalPrice,
  showTikkieMessagewithButton,
  showTikkieMessage,
  PaymentLinkres,
  placeOrderButton,
}) {
  console.log("ticketdata", ticketdata);
  const {
    data = [],
    isFetching,
    error,
  } = useGetPaymentProfileQuery(ticketdata?.data?.userObj?._id);
  console.log("main_reduxstate", data, { error });
  const [paymentMethods, setpaymentMethods] = useState([
    {
      label: "Pay  at Venue",
      value: "pay-at-venue",
      fee: "",
      icon: <PayIcon />,
    },
  ]);

  useEffect(() => {
    if (!isFetching) {
      if (
        data?.data?.paymentType == "Tikkie" &&
        data?.data?.isEnabled == true
      ) {
        setpaymentMethods([
          {
            label: "Tikkie",
            value: "tikkie",
            fee: "free",
            icon: <TikkieIcon />,
          },
          ...paymentMethods,
        ]);
      } else if (
        data?.data?.paymentType == "Stripe" &&
        data?.data?.isEnabled == true
      ) {
        setpaymentMethods([
          {
            label: "Google Pay",
            value: "google-pay",
            fee: "",
            icon: <GoogleIcon />,
          },
          {
            label: "Apple Pay",
            value: "apple-pay",
            fee: "",
            icon: <AppleIcon />,
          },
          {
            label: "Credit card",
            value: "credit-card",
            fee: "",
            icon: <CardIcon />,
          },
          ...paymentMethods,
        ]);
      }
    }
  }, [isFetching]);

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <div className="ticket-booking_step-three">
      {/* Payment Method */}
      {PaymentLinkres && showTikkieMessagewithButton ? (
        showTikkieMessage ? (
          <div className="section complete-payment-msg">
            <div className="loading">
              <Loader size={30} thin={2} />
            </div>
            <div className="tit">
              Please complete payments via Tikkie on another window just opened
              and return back to this window.
            </div>
          </div>
        ) : (
          <div className="section tikkie-new-tab-section">
            <div className="icon">
              <TikkieIcon />
            </div>
            <div className="label">
              Tikkie needs to open new window to complete the payment flow
            </div>
            <button
              className="button-primary open-tab-btn"
              onClick={placeOrderButton}
            >
              Open Tikkie Window
              <ArrowRightIcon />
            </button>
          </div>
        )
      ) : (
        totalPrice > 0 && (
          <div className="section payment-methods">
            <div className="label">
              Select the payment method you want to use.
            </div>
            <div className="methods-list">
              {paymentMethods.map((item, index) => (
                <div
                  key={index}
                  className="item"
                  onClick={() => setSelectedPaymentMethod(item.value)}
                >
                  <div className="lit">
                    <div className="icon">{item.icon}</div>
                    <div className="meta">
                      <div className="lbl">{item.label}</div>
                      {item?.fee && <div className="text">{item.fee}</div>}
                    </div>
                  </div>
                  <div className="rit">
                    <div
                      className={`radio-item ${
                        selectedPaymentMethod === item.value ? "active" : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default StepThree;
