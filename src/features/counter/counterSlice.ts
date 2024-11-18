// src/features/counterSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  showFilterTag: boolean;
}

const initialState: CounterState = {
  value: 0,
  showFilterTag: false,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    setShowFilterTag: (state, { payload }) => {
      state.showFilterTag = payload;
    },
  },
});

export const { increment, setShowFilterTag } = counterSlice.actions;

export default counterSlice.reducer;
