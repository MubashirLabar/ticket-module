import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";

export const sendOtpToAddParticipant = async (
  ticketFields,
  setLoading,
  setver_token,
  reduxstate
) => {
  setLoading(true);
  console.log("ticketFields", reduxstate);
  try {
    const config = {
      method: "post",
      url: "https://bmcapi-dev.bookzy.app/dev/users/sendOtpToAddParticipant",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        scheduleClassId: reduxstate.scheduleId,
        isPackage: false,
        username: `+${ticketFields.username}`,
        fullName: ticketFields.fullName,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("response...", response.data);
        toast(response?.data?.message, {
          type: "success",
        });
        setLoading(false);
        setver_token(response.data?.data?.token);
        //setSelectedStep(1);
      })
      .catch(function (error) {
        console.log(error);
        toast(error.message, {
          type: "error",
        });
        setLoading(false);
      });
  } catch (error) {
    console.log("error....", error);
    toast(error.message, {
      type: "error",
    });
    setLoading(false);
  }
};

export const verifyOtpToAddParticipant = async (
  code,
  setLoading,
  id,
  ver_token,
  setPhoneVerified,
  setbookingconfirmed
) => {
  setLoading(true);
  console.log("ver_code", {
    code: code,
    token: ver_token,
  });
  try {
    const config = {
      method: "post",
      url: "https://bmcapi-dev.bookzy.app/dev/users/verifyOtpToAddParticipant",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        code,
        token: ver_token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("response...", response.data);
        // toast(response?.data?.message, {
        //   type: "success",
        // });
        setLoading(false);
        if (response?.data?.data?.userId) {
          setPhoneVerified(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast(error.message, {
          type: "error",
        });
        setLoading(false);
      });
  } catch (error) {
    console.log("error....", error);
    toast(error.message, {
      type: "error",
    });
    setLoading(false);
  }
};

export const checkLinkPaymentStatus = async (
  paymentRequestToken,
  id,
  setLoading,
  setbookingconfirmed,
  ticketFields,
  reduxstate,
  totalPrice,
  setopenTikkiePaymentModal
) => {
  //setLoading(true);
  console.log("checkLinkPaymentStatus_dataaa", {
    data: {
      paymentRequestToken,
      reduxstate,
    },
  });
  try {
    const config = {
      method: "post",
      url: "https://bmcapi-dev.bookzy.app/dev/schools/checkLinkPaymentStatus",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        paymentRequestToken,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("response...", response.data);
        if (response?.data?.data?.numberOfPayments < 1) {
          setTimeout(() => {
            checkLinkPaymentStatus(
              paymentRequestToken,
              id,
              setLoading,
              setbookingconfirmed,
              ticketFields,
              reduxstate,
              totalPrice,
              setopenTikkiePaymentModal
            );
          }, 2000);
        } else {
          //setbookingconfirmed(true)
          addParticipant(
            ticketFields,
            reduxstate,
            null,
            setbookingconfirmed,
            true,
            totalPrice,
            setopenTikkiePaymentModal
          );
          //history.push(`order-confirmation/${id}`)
          //window.open(`${window.location.origin}/order-confirmation/${id}`,"_self");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast(error.message, {
          type: "error",
        });
      });
  } catch (error) {
    console.log("error....", error);
    toast(error.message, {
      type: "error",
    });
  }
};

export const createPaymentLink = async (
  ticketFields,
  setLoading,
  reduxstate,
  totalPrice,
  id,
  setbookingconfirmed,
  setopen_in_new_tab,
  setopenTikkiePaymentModal
) => {
  //setLoading(true);
  console.log("dataaa", {
    data: {
      amount: totalPrice.toFixed(2),
      scheduleId: reduxstate.id,
      isPackage: false,
    },
  });
  try {
    const config = {
      method: "post",
      url: "https://kzyr3n2xc0.execute-api.eu-central-1.amazonaws.com/dev/schools/createPaymentLink",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        amount: totalPrice.toFixed(2),
        scheduleId: reduxstate.id,
        isPackage: false,
      },
    };
    let response = await axios(config);
    return response?.data;
  } catch (error) {
    console.log("error....", error);
    toast(error.message, {
      type: "error",
    });
  }
};

export const addParticipant = async (
  ticketFields,
  reduxstate,
  setLoading,
  setbookingconfirmed,
  paid,
  totalPrice,
  setopenTikkiePaymentModal
) => {
  if (setLoading) {
    setLoading(true);
  }
  const mod_ticketFields = [];
  ticketFields.selectedEventPricing?.map((item) => {
    if (item?.bookingQty > 0) {
      mod_ticketFields.push({
        bookingQty: item?.bookingQty,
        totalPrice: item?.totalPrice,
        ticketType: item?.ticketType,
        serviceFee: item?.serviceFee,
        ticketAmount: Number(item.amount),
      });
    }
  });

  console.log("addParticipant-data", {
    reduxstate,
    scheduleClassId: reduxstate.id,
    type: "add",
    isPackage: false,
    isEvent: true,
    username: ticketFields.username,
    fullName: ticketFields.fullName,
    isPaid: paid ? true : false,
    selectedEventPricing: mod_ticketFields,
    totalPrice,
    bookingId: ticketFields.referenceId,
  });

  try {
    const config = {
      method: "post",
      url: "https://bmcapi-dev.bookzy.app/dev/users/addParticipant",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        scheduleClassId: reduxstate.id,
        type: "add",
        isPackage: false,
        isEvent: true,
        username: ticketFields.username,
        fullName: ticketFields.fullName,
        email: ticketFields.email,
        isPaid: paid ? true : false,
        selectedEventPricing: mod_ticketFields,
        bookingId: ticketFields.referenceId,
      },
    };
    axios(config)
      .then(async function (response) {
        console.log("response...", response.data);
        // toast(response?.data?.message, {
        //   type: "success",
        // });
        //setLoading(false);
        //setbookingconfirmed(true)
        await SendEmailtoParticipant(
          ticketFields,
          reduxstate,
          response.data?.data,
          totalPrice,
          setbookingconfirmed,
          setLoading,
          setopenTikkiePaymentModal
        );
        //setSelectedStep(1);
      })
      .catch(function (error) {
        console.log(error);
        toast(error.message, {
          type: "error",
        });
        if (setLoading) {
          setLoading(false);
        }
      });
  } catch (error) {
    console.log("error....", error);
    toast(error.message, {
      type: "error",
    });
    if (setLoading) {
      setLoading(false);
    }
  }
};

export const SendEmailtoParticipant = async (
  ticketFields,
  reduxstate,
  addParticipantresponse,
  totalPrice,
  setbookingconfirmed,
  setLoading,
  setopenTikkiePaymentModal
) => {
  //setLoading(true);
  console.log("SendEmailtoParticipant-data", {
    ticketFields,
    reduxstate,
    addParticipantresponse,
    fromEmail: "info@bookzy.nl",
    name: ticketFields.username,
    toEmail: ticketFields.email,
    bookingId: addParticipantresponse?.bookingId,
    bookingDate: new Date(),
    selectedEventPricing: totalPrice,
  });
  try {
    const config = {
      method: "post",
      url: "https://bmcapi-dev.bookzy.app/dev/users/sendBookingConfirmation",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        fromEmail: "info@bookzy.nl",
        name: ticketFields.fullName,
        toEmail: ticketFields.email,
        bookingId: addParticipantresponse?.bookingId,
        bookingDate: moment(new Date()).format("MMM Do YY, h:mm"),
        totalPrice: totalPrice,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("SendEmailtoParticipant_response...", response.data);
        // toast(`${response?.data?.message} ${ticketFields.email}`, {
        //   type: "success",
        // });
        //
        setbookingconfirmed(addParticipantresponse);
        if (setopenTikkiePaymentModal) {
          setopenTikkiePaymentModal(false);
        }
        if (setLoading) {
          setLoading(false);
        }
        //setSelectedStep(1);
      })
      .catch(function (error) {
        console.log(error);
        toast(error.message, {
          type: "error",
        });
        //setLoading(false);
      });
  } catch (error) {
    console.log("error....", error);
    toast(error.message, {
      type: "error",
    });
    //setLoading(false);
  }
};
