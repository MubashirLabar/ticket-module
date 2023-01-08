import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const Slice = createSlice({
  name: "State",
  initialState,
  reducers: {
    updatestate: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updatestate } = Slice.actions;

export default Slice.reducer;
