import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetTicketsInfoQuery } from "store/services/ticketServices";
import { LocationIcon, TimerIcon, ShareIcon, CheckIcon } from "assets/icon";
import moment from "moment";
import { Loader } from "components";
import { useSelector } from "react-redux";

function OrderConfirmation({ bookingconfirmed, totalPrice }) {
  const id = window.localStorage.getItem("bookingID") || "";
  const { data = [], isFetching } = useGetTicketsInfoQuery(id);
  const reduxstate = useSelector((state) => state.State);
  const [totalServiceFee, setTotalServiceFee] = useState(0);
  console.log("bookingconfirmed...", bookingconfirmed);

  useEffect(() => {
    let fee = 0;
    if (bookingconfirmed?.ticketsBought.length) {
      bookingconfirmed?.ticketsBought.forEach((item) => {
        fee = fee + Number(item.serviceFee);
      });
      setTotalServiceFee(fee);
    }
  }, [bookingconfirmed]);

  if (isFetching) {
    return (
      <div className="ticket-view-loading">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="ticket-booking order-confirmation">
      <div className="wrapper">
        <div className="page-hdr">
          <div className="title">Booking Confirmation</div>
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
                      )?.format("MMM Do YY, h:mm a")} - ${moment(
                        reduxstate?.classDate
                      )
                        ?.add(data?.data?.duration, "minutes")
                        .format("MMM Do YY, h:mm a")}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section payment-due">
            {bookingconfirmed?.paymentStatus == "Unpaid" ? (
              <div className="title">Payments Due</div>
            ) : (
              <div className="title">
                Payment Confirmed
                <div className="icon">
                  <CheckIcon />
                </div>
              </div>
            )}
            <div className="ticks">
              {bookingconfirmed?.ticketsBought?.map((item, index) => (
                <div key={index} className="item">
                  <div className="lit">
                    <div className="lbl">{item?.ticketType}</div>
                    <div className="price">
                      {`€${item.ticketAmount} + €${item.serviceFee} fee.`}
                    </div>
                  </div>
                  <div className="rit">
                    <div className="qty">
                      {item?.bookingQty} X €
                      {Number(item.ticketAmount) + Number(item.serviceFee)}{" "}
                    </div>
                    <div className="price">{item?.totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="total">
              <div className="text">{`Total (incl. tax & €${totalServiceFee} booking Fee)`}</div>
              <div className="price">€{totalPrice.toFixed(2)}</div>
            </div>
            {bookingconfirmed?.paymentStatus == "Unpaid" && (
              <div className="notice">
                Host will may send you a payment request before start of the
                event
              </div>
            )}
          </div>
          <div className="section success-blk">
            <img src="/images/success.svg" className="vector" />
            <div className="label">Your Order is Confirmed!!</div>
            <div className="text">Your Booking Details are sent to</div>
            <div className="address">{reduxstate.email}</div>
          </div>
          {/* <div className="section share-blk">
            <button className="button-primary">
              Share <ShareIcon />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
