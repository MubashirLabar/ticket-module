import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookingConfirmation from "views/BookingConfirmation";

import OrderConfirmation from "views/OrderConfirmation";

// Pages
const TicketBooking = lazy(() => import("views/TicketBooking"));
const TicketLoading = lazy(() => import("views/TicketLoading"));

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<TicketLoading />} />
        <Route path="/booking/:name" element={<TicketBooking />} />
        <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
        {/* <Route path="order-confirmation/:id" element={<OrderConfirmation />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
