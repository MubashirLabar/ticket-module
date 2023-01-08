import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import { isValidEmail } from "core";
import {
  ChevronsIconLeft,
  ChevronsIconRight,
  LocationIcon,
  MinusIcon,
  PlusIcon,
  TimerIcon,
} from "assets/icon";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { useGetTicketsInfoQuery } from "store/services/ticketServices";
import { Loader, Modal } from "components";
import moment from "moment";
import PhoneVerification from "./PhoneVerification";
import OrderConfirmation from "../OrderConfirmation/index";
import PhoneVerified from "./PhoneVerified";
import {
  sendOtpToAddParticipant,
  verifyOtpToAddParticipant,
  createPaymentLink,
  addParticipant,
  checkLinkPaymentStatus,
} from "../../core/methods";
import { Route, Routes, useNavigate } from "react-router-dom";
import { updatestate } from "../../store/reducer/index";
import TikkiePaymentModal from "modals/TikkiePaymentModal";
import OtpConfirmModal from "modals/OtpConfirmModal";

function Home() {
  const dispatch = useDispatch();
  const id = window.localStorage.getItem("ticksID") || "";
  const [selectedStep, setSelectedStep] = useState("");
  const { data = "", isFetching } = useGetTicketsInfoQuery(id);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const reduxstate = useSelector((state) => state.State);
  const [ticketFields, setTicketFields] = useState({
    scheduleClassId: "",
    type: "add",
    isPackage: false,
    isEvent: true,
    username: "",
    fullName: "",
    email: "",
    referenceId: "",
    isPaid: false,
    selectedEventPricing: [],
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [ver_code, setver_code] = useState({});
  const [ver_token, setver_token] = useState(false);
  const [open_in_new_tab, setopen_in_new_tab] = useState("");
  const [showTikkieMessage, setshowTikkieMessage] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [bookingconfirmed, setbookingconfirmed] = useState(false);
  const [showTikkieMessagewithButton, setshowTikkieMessagewithButton] =
    useState(false);
  const [PaymentLinkres, setPaymentLinkres] = useState({});
  const [createPaymentLoading, setCreatePaymentLoading] = useState(false);
  const [callagain, setcallagain] = useState(false);
  const [totalServiceFee, setTotalServiceFee] = useState(0);
  const [otpConfirmModal, setOtpConfirmModal] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);

  useEffect(() => {
    if (!isFetching) {
      setTicketFields({
        ...ticketFields,
        selectedEventPricing: data?.data?.eventPricingList,
      });
      setSelectedStep(1);
    }
  }, [data]);

  useEffect(() => {
    if (open_in_new_tab) {
      window.open(open_in_new_tab, "_blank").focus();
    }
  }, [open_in_new_tab]);

  useEffect(() => {
    let total = 0;
    ticketFields?.selectedEventPricing?.map((item) => {
      if (item?.bookingQty) {
        if (item?.bookingQty > 0) {
          // total = total + item?.amount * item?.bookingQty;
          total =
            total +
            (Number(item.amount) + Number(item.serviceFee))?.toFixed(2) *
              item?.bookingQty;
        }
      }
    });
    setTotalPrice(total);
  }, [ticketFields?.selectedEventPricing]);

  useEffect(() => {
    if (callagain) {
      setopen_in_new_tab(PaymentLinkres?.url);
      checkLinkPaymentStatus(
        PaymentLinkres?.paymentRequestToken,
        id,
        setLoading,
        setbookingconfirmed,
        ticketFields,
        reduxstate,
        totalPrice,
        null
      );
    }
  }, [callagain]);

  const getPaymentLink = async () => {
    setCreatePaymentLoading(true);
    if (
      selectedPaymentMethod != "pay-at-venue" &&
      selectedPaymentMethod != ""
    ) {
      let res = await createPaymentLink(
        ticketFields,
        setLoading,
        reduxstate,
        totalPrice,
        id,
        setbookingconfirmed,
        setopen_in_new_tab,
        setshowTikkieMessage
      );
      if (res) {
        setCreatePaymentLoading(false);
        // setshowTikkieMessagewithButton(true);
        setPaymentLinkres(res?.data);
        setTicketFields({
          ...ticketFields,
          referenceId: res?.data?.referenceId,
        });
        localStorage.setItem("bookingID", res?.data?.referenceId);
        window.location.replace(res?.data?.url);
      } else {
        setCreatePaymentLoading(false);
      }
    } else {
      setCreatePaymentLoading(false);
    }
  };

  const minusTicketButton = (item) => {
    let the_tickets = [...ticketFields?.selectedEventPricing];
    var foundIndex = the_tickets.findIndex(
      (x) => x.ticketType === item.ticketType
    );
    if (foundIndex >= 0) {
      let qty = the_tickets[foundIndex]?.bookingQty
        ? the_tickets[foundIndex]?.bookingQty - 1
        : 0;
      let total =
        (
          Number(the_tickets[foundIndex]?.amount) +
          Number(the_tickets[foundIndex]?.serviceFee)
        )?.toFixed(2) * qty;
      the_tickets[foundIndex] = {
        ...the_tickets[foundIndex],
        bookingQty: qty,
        totalPrice: total,
      };
      setTicketFields({ ...ticketFields, selectedEventPricing: the_tickets });
      setTotalServiceFee(
        totalServiceFee - Number(the_tickets[foundIndex]?.serviceFee)
      );
    }
  };

  console.log("ticketFields...", data?.data);
  const addTicketButton = (item) => {
    let the_tickets = [...ticketFields?.selectedEventPricing];
    var foundIndex = the_tickets.findIndex(
      (x) => x.ticketType === item.ticketType
    );
    if (foundIndex >= 0) {
      let qty = the_tickets[foundIndex]?.bookingQty
        ? the_tickets[foundIndex]?.bookingQty + 1
        : 1;
      let total =
        (
          Number(the_tickets[foundIndex]?.amount) +
          Number(the_tickets[foundIndex]?.serviceFee)
        )?.toFixed(2) * qty;
      the_tickets[foundIndex] = {
        ...the_tickets[foundIndex],
        bookingQty: qty,
        totalPrice: total,
      };
      let service =
        totalServiceFee + Number(the_tickets[foundIndex]?.serviceFee);
      setTicketFields({ ...ticketFields, selectedEventPricing: the_tickets });
      setTotalServiceFee(service);
    }
  };

  const nextStep = () => {
    if (selectedStep === 1) {
      if (agreeTerms) {
        handleStepOne();
      } else {
        toast("Please agree our terms", {
          type: "error",
        });
      }
    } else if (selectedStep === 2) {
      dispatch(updatestate(ticketFields));
      handleStepTwo();
    }
  };

  const prevStep = () => {
    setSelectedStep(selectedStep - 1);
  };

  const handleStepOne = () => {
    let foundSelectedTickedExist = false;
    ticketFields?.selectedEventPricing?.map((item) => {
      if (item?.bookingQty) {
        if (item?.bookingQty > 0) {
          foundSelectedTickedExist = true;
        }
      }
    });
    if (!foundSelectedTickedExist) {
      toast("Select at least once ticket", {
        type: "error",
      });
    } else {
      setTicketFields({
        ...ticketFields,
        scheduleClassId: data?.data?.scheduleClassId,
      });
      setSelectedStep(selectedStep + 1);
    }
  };

  const handleStepTwo = () => {
    if (!ticketFields.fullName) {
      toast("Full name is required", {
        type: "error",
      });
    } else if (!ticketFields.email) {
      toast("Email is required", {
        type: "error",
      });
    } else if (!isValidEmail(ticketFields.email)) {
      toast("Email is invalid", {
        type: "error",
      });
    } else if (!ticketFields.username) {
      toast("Phone number is required", {
        type: "error",
      });
    } else {
      setSelectedStep(selectedStep + 1);
    }
  };

  const placeOrderButton = async () => {
    if (totalPrice < 1) {
      addParticipant(
        ticketFields,
        reduxstate,
        setLoading,
        setbookingconfirmed,
        true,
        totalPrice,
        setshowTikkieMessage
      );
    } else {
      setshowTikkieMessage(true);
      if (PaymentLinkres == {}) {
        setTimeout(() => {
          setcallagain(true);
        }, 1000);
      } else {
        setopen_in_new_tab(PaymentLinkres?.url);
        checkLinkPaymentStatus(
          PaymentLinkres?.paymentRequestToken,
          id,
          setLoading,
          setbookingconfirmed,
          ticketFields,
          reduxstate,
          totalPrice,
          null
        );
      }
    }
  };

  const handlePayAndVerify = (code) => {
    if (selectedStep == 4) {
      if (phoneVerified) {
        addParticipant(
          ticketFields,
          reduxstate,
          setLoading,
          setbookingconfirmed,
          false,
          totalPrice
        );
      } else {
        verifyOtpToAddParticipant(
          code,
          setLoading,
          id,
          ver_token,
          setPhoneVerified,
          reduxstate,
          setbookingconfirmed
        );
      }
    } else {
      setOtpConfirmModal(true);
    }
  };

  const handleSendOtp = () => {
    sendOtpToAddParticipant(ticketFields, setLoading, setver_token, reduxstate);
  };

  const handleCancelButtonOptModal = () => {
    setOtpConfirmModal(false);
  };

  const handleConfirmButtonOtpModal = () => {
    setSelectedStep(4);
    handleSendOtp();
    setOtpConfirmModal(false);
  };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  if (isFetching) {
    return (
      <div className="ticket-view-loading">
        <Loader size={40} />
      </div>
    );
  }

  console.log("createPaymentLoading....", createPaymentLoading);

  return (
    <>
      <div className="ticket-booking">
        {!bookingconfirmed && (
          <div className="wrapper">
            <div className="page-hdr">
              {selectedStep > 1 && (
                <button className="back-btn" onClick={prevStep}>
                  <ChevronsIconLeft />
                  <div className="lbl">Back</div>
                </button>
              )}
              <div className="title">
                {selectedStep === 1
                  ? "Tickets"
                  : selectedStep === 2
                  ? "Information"
                  : selectedStep === 3
                  ? "Payment"
                  : ""}
                &nbsp;
                <span>{`${selectedStep}/${
                  selectedPaymentMethod === "pay-at-venue" ? 4 : 3
                }`}</span>
              </div>
            </div>

            <div className="content">
              {/* Ticket Info*/}
              <div className="section">
                <div className="block info">
                  <div className="sub-blk">
                    <div
                      className="image"
                      style={{
                        backgroundImage: `url(${data?.data?.classPhoto})`,
                      }}
                    />
                    <div className="meta">
                      <div className="title">{data?.data?.className}</div>
                      <div className="host">
                        <div
                          className="dp"
                          style={{
                            backgroundImage: `url(${data?.data?.userObj?.profilePic})`,
                          }}
                        />
                        <div className="host-meta">
                          <div className="by">Hosted by</div>
                          <div className="user-name">
                            {data?.data?.userObj?.fullName}
                          </div>
                        </div>
                      </div>
                      {selectedStep !== 1 && (
                        <>
                          <div className="item">
                            <div className="icon">
                              <LocationIcon />
                            </div>
                            <div className="meta">
                              <div className="lbl">Where</div>
                              <div className="value">
                                {reduxstate?.location?.addressName}
                              </div>
                              <div className="text">
                                {reduxstate?.location?.address}
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="icon">
                              <TimerIcon />
                            </div>
                            <div className="meta">
                              <div className="lbl">When</div>
                              <div className="value">{`${moment(
                                reduxstate?.classDate
                              ).format("MMM Do YY, h:mm a")} - ${moment(
                                reduxstate?.classEndDate
                              ).format("MMM Do YY, h:mm a")}`}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedStep === 1 && data?.data?.description && (
                    <div className="about-blk">
                      <div className="label">About Event</div>
                      <div className="description">
                        {isReadMore
                          ? data.data.description.slice(0, 240)
                          : data?.data.description}
                        {""}
                        <span onClick={toggleReadMore} className="read-or-hide">
                          {isReadMore ? "Read more..." : " Show less"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <>
                {selectedStep === 1 && (
                  <StepOne
                    data={data}
                    isFetching={isFetching}
                    setTotalPrice={setTotalPrice}
                    ticketFields={ticketFields}
                    setTicketFields={setTicketFields}
                    agreeTerms={agreeTerms}
                    setAgreeTerms={setAgreeTerms}
                  />
                )}
                {selectedStep === 2 && (
                  <StepTwo
                    ticketFields={ticketFields}
                    setTicketFields={setTicketFields}
                  />
                )}
                {selectedStep === 3 && (
                  <StepThree
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    showTikkieMessagewithButton={showTikkieMessagewithButton}
                    PaymentLinkres={PaymentLinkres}
                    ticketdata={data}
                    totalPrice={totalPrice}
                    showTikkieMessage={showTikkieMessage}
                    placeOrderButton={placeOrderButton}
                  />
                )}
                {selectedStep === 4 && (
                  <>
                    {phoneVerified ? (
                      <PhoneVerified ticketFields={ticketFields} />
                    ) : (
                      <PhoneVerification
                        phoneVerified={phoneVerified}
                        setPhoneVerified={setPhoneVerified}
                        ticketFields={ticketFields}
                        setver_code={setver_code}
                        ver_code={ver_code}
                        handlePayAndVerify={handlePayAndVerify}
                        setSelectedStep={setSelectedStep}
                        handleSendOtp={handleSendOtp}
                      />
                    )}
                  </>
                )}
              </>

              {/* Tickets */}
              {selectedStep === 1 && (
                <div className="section">
                  <div className="block ticket-types">
                    {data?.data?.eventPricingList?.length > 0 &&
                      ticketFields?.selectedEventPricing?.map((item, index) => (
                        <div className="item" key={index}>
                          <div className="lit">
                            <div className="meta">
                              <div className="title">{item.ticketType}</div>
                              <div className="text">{`€${item.amount} + €${item.serviceFee} fee.`}</div>
                            </div>
                          </div>
                          <div className="rit">
                            <>
                              <div className="actions">
                                <button
                                  className="action"
                                  onClick={() => minusTicketButton(item)}
                                  disabled={
                                    item?.bookingQty <= 0 || !item?.bookingQty
                                  }
                                >
                                  <MinusIcon />
                                </button>
                                <div className="price">
                                  {item?.bookingQty ? item?.bookingQty : 0}
                                </div>
                                <button
                                  className="action"
                                  onClick={() => addTicketButton(item)}
                                >
                                  <PlusIcon />
                                </button>
                              </div>
                              <div className="meta">
                                <div className="text">{`${
                                  item?.bookingQty ? item?.bookingQty : 0
                                } X €${
                                  Number(item.amount) + Number(item.serviceFee)
                                }`}</div>
                                <div
                                  className={`sub-total ${
                                    item?.bookingQty > 0 ? "active" : ""
                                  }`}
                                >
                                  €
                                  {item?.bookingQty
                                    ? (
                                        Number(item.amount) +
                                        Number(item.serviceFee)
                                      )?.toFixed(2) * item?.bookingQty
                                    : 0.0}
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Sub Total */}
              <div className="sub-total-blk">
                <div className="meta">
                  <div className="title">
                    {`Total (incl. tax & €${totalServiceFee} booking fee)`}
                  </div>
                  <div className="price">€{totalPrice.toFixed(2)}</div>
                </div>
                <div className="rit">
                  {selectedStep === 3 || selectedStep === 4 ? (
                    <>
                      {selectedPaymentMethod === "pay-at-venue" ? (
                        <button
                          className="button-primary next-btn"
                          onClick={handlePayAndVerify}
                        >
                          {phoneVerified ? "Place Order" : "Verify Phone"}
                        </button>
                      ) : (
                        <button
                          className="button-primary next-btn"
                          onClick={() => {
                            if (totalPrice < 1) {
                              placeOrderButton();
                            } else {
                              getPaymentLink();
                            }
                          }}
                        >
                          {!showTikkieMessagewithButton &&
                          !createPaymentLoading ? (
                            <span>
                              Next <ChevronsIconRight />
                            </span>
                          ) : (
                            <Loader size={22} thin={2} />
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="button-primary next-btn"
                      onClick={nextStep}
                    >
                      Next <ChevronsIconRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {bookingconfirmed && (
          <>
            {
              <OrderConfirmation
                reduxstate={reduxstate}
                ticketFields={ticketFields}
                bookingconfirmed={bookingconfirmed}
                totalPrice={totalPrice}
              />
            }
          </>
        )}
        {loading && (
          <div className="overlay">
            <Loader />
          </div>
        )}
      </div>
      <OtpConfirmModal
        open={otpConfirmModal}
        onClose={handleCancelButtonOptModal}
        onConfirm={handleConfirmButtonOtpModal}
      />

      {/* Tikkie Payment Modal */}
      {/* <TikkiePaymentModal
        openTikkiePaymentModal={openTikkiePaymentModal}
        setOpenTikkiePaymentModal={setOpenTikkiePaymentModal}
      /> */}
    </>
  );
}

export default Home;
