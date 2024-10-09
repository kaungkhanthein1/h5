import { createSlice } from "@reduxjs/toolkit";

interface HistoryState {
  data: any[];
}

const initialState: HistoryState = {
  data: [],
};

export const HistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistoryData: (state, action) => {
      const { data } = action.payload;
      const existingDataIndex = state.data.findIndex((item) => item === data);
      if (existingDataIndex === -1) {
        // If data with the same vod_id doesn't exist, add it
        state.data = [data, ...state.data];
      }
      if (state.data.length > 20) {
        state.data.pop();
      }
    },
    clearData: (state, action) => {
      state.data = [];
    },
  },
});

// Actions generated from the slice
export const { setHistoryData, clearData } = HistorySlice.actions;

// A selector to get the navbar data from the state
export const selectHistoryData = (state: any) => state.history.data;

// The reducer
export default HistorySlice.reducer;
