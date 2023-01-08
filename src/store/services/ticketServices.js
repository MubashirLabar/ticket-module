import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ticketServices = createApi({
  reducerPath: "ticket",
  tagType: "ticket-booking",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bmcapi-dev.bookzy.app",
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.token;
      headers.set("authorization", token ? `Bearer ${token}` : "");
      return headers;
    },
  }),

  endpoints: (builder) => {
    return {
      getTicketsInfo: builder.query({
        query: (id) => {
          return {
            url: `/dev/users/validateBookingViaClassLink/${id}`,
            method: "GET",
          };
        },
        providesTags: ["ticket-booking"],
      }),
      getPaymentProfile: builder.query({
        query: (id) => {
          return {
            url: `/dev/schools/getPaymentProfile?teacherID=${id}`,
            method: "GET",
          };
        },
        providesTags: ["ticket-booking"],
      }),

      getBookingConfirmation: builder.query({
        query: (id) => {
          return {
            url: `/dev/users/bookings/${id}`,
            method: "GET",
          };
        },
        providesTags: ["ticket-booking"],
      }),
    };
  },
});

export const {
  useGetTicketsInfoQuery,
  useGetPaymentProfileQuery,
  useGetBookingConfirmationQuery,
} = ticketServices;

export default ticketServices;
