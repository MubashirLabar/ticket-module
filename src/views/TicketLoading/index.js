import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Splash } from "components";
import { useGetTicketsInfoQuery } from "store/services/ticketServices";

function TicketLoading(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data = "", isFetching } = useGetTicketsInfoQuery(id);

  useEffect(() => {
    if (!isFetching && id) {
      localStorage.setItem("ticksID", id);
      let className = data?.data?.className
        ? data.data.className.replace(/\s+/g, "-").toLowerCase()
        : "event";
      navigate(`/booking/${className}`);
    }
  }, [data]);

  return <Splash />;
}

export default TicketLoading;
