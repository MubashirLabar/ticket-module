import { configureStore } from "@reduxjs/toolkit";
import ticketServices from "./services/ticketServices";
import stateReducer from './reducer/index'


const Store = configureStore({
  reducer: {
    [ticketServices.reducerPath]: ticketServices.reducer,
    State: stateReducer,
  },
});

export default Store;
