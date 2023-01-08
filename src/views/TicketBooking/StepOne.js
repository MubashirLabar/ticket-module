import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalenderIcon,
  CheckIcon,
  ClockIcon,
  LocationIcon,
  PercentageIcon,
  TimerIcon,
} from "assets/icon";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { updatestate } from "../../store/reducer/index";

function StepOne({
  data,
  isFetching,
  agreeTerms,
  setAgreeTerms,
  setTotalPrice,
  ticketFields,
  setTicketFields,
}) {
  const [selectedEvent, setselectedEvent] = useState(false);
  const reduxstate = useSelector((state) => state.State);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [includedDates, setIncludedDates] = useState([]);

  console.log("reduxstate", reduxstate);
  console.log("isFetching", isFetching);

  useEffect(() => {
    if (!isFetching) {
      let eventsDate = [];
      if (data?.data?.scheduleclasses?.length > 1) {
        if (data?.data?.scheduleclasses.length) {
          data?.data?.scheduleclasses.forEach((item, index) => {
            eventsDate.push(new Date(item.classDate).getTime());
          });
        }
        setIncludedDates(eventsDate);
        setselectedEvent(data?.data?.scheduleclasses[0]);
        dispatch(updatestate(data?.data?.scheduleclasses[0]));
        setSelectedDate(eventsDate[0]);
      } else {
        setIncludedDates([
          new Date(data?.data?.scheduleclasses[0]?.classDate).getTime(),
        ]);
        setselectedEvent(data?.data?.scheduleclasses[0]);
        dispatch(updatestate(data?.data?.scheduleclasses[0]));
        // setSelectedDate(eventsDate[new Date(data?.data?.scheduleclasses[0]?.classDate).getTime()])
      }
    }
  }, [data]);

  useEffect(() => {
    if (!isFetching) {
      if (selectedDate) {
        let theitem = data?.data?.scheduleclasses?.find((item) => {
          return (
            moment(selectedDate).format("MMM Do YY") ==
            moment(item?.classDate).format("MMM Do YY")
          );
        });
        console.log("theitem", theitem);
        if (theitem) {
          setselectedEvent(theitem);
          dispatch(updatestate(theitem));
        }
      }
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setOpenCalendar(false);
  };

  return (
    <div className="ticket-booking_step-one">
      {/* Details */}
      <div className="section">
        <div className="block details">
          <div className="item">
            <div className="icon">
              <LocationIcon />
            </div>
            <div className="meta">
              <div className="lbl">Where</div>
              <div className="value">{reduxstate?.location?.addressName}</div>
              <div className="text">{reduxstate?.location?.address}</div>
            </div>
          </div>
          <div className="item">
            <div className="icon">
              <ClockIcon />
            </div>
            <div className="meta">
              <div className="lbl">Timing</div>
              <div className="value">{data?.data?.duration} Minutes</div>
            </div>
          </div>
          <div className="item calender-item">
            <div className="row-blk">
              <div className="icon">
                <TimerIcon />
              </div>
              <div className="meta">
                <div className="lbl">When</div>
                <div className="value">{`${moment(reduxstate?.classDate).format(
                  "MMM Do YY, h:mm a"
                )} - ${moment(reduxstate?.classEndDate).format(
                  "MMM Do YY, h:mm a"
                )}`}</div>
              </div>
            </div>
            {selectedDate && (
              <div className="row-blk">
                <div className="icon icon-calender" />
                <div className="calender-blk">
                  <div
                    className="calender-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCalendar(!openCalendar);
                    }}
                  >
                    <CalenderIcon />
                    Choose another Date
                  </div>
                  <DatePicker
                    dateFormat="MMMM d, yyyy h:mm aa"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    open={openCalendar}
                    includeDates={includedDates}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promo Code */}
      {/* <div className="section promotional">
        {openPromoCode ? (
          <div className="promo-field">
            <div className="icon">
              <PercentageIcon />
            </div>
            <input
              types="text"
              placeholder="Promotional code"
              className="input"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="button-primary add-btn" disabled={!promoCode}>
              Add
            </button>
          </div>
        ) : (
          <button className="promo-btn" onClick={() => setOpenPromoCode(true)}>
            <PercentageIcon />
            <div className="lbl">Enter a promotional code</div>
          </button>
        )}
      </div> */}

      {/* Terms and Condition */}
      <label
        className="section terms"
        onClick={() => setAgreeTerms(!agreeTerms)}
      >
        <div className={`checkbox ${agreeTerms ? "active" : ""}`}>
          <CheckIcon />
        </div>
        <div className="lbl">
          I agree to the{" "}
          <Link to="/" className="link">
            terms of service
          </Link>{" "}
          of Bookzy
        </div>
      </label>
    </div>
  );
}

export default StepOne;
