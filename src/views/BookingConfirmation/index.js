import React, { useState } from "react";
import { useGetBookingConfirmationQuery } from "store/services/ticketServices";
import { useSelector } from "react-redux";

function BookingConfirmation({ bookingconfirmed, totalPrice }) {
  const id = window.localStorage.getItem("bookingID") || "";
  const { data = [], isFetching } = useGetBookingConfirmationQuery(id);
  const reduxstate = useSelector((state) => state.State);
  console.log("booking confirmed...", data);

  return <div>Booking Confirmation</div>;
}

export default BookingConfirmation;
