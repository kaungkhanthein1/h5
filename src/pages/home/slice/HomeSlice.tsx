import { createSlice } from "@reduxjs/toolkit";

const HomeSlice = createSlice({
  name: "home",
  initialState: { activeTab: 0 },
  reducers: {
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
  },
});

export const { setActiveTab } = HomeSlice.actions;
export default HomeSlice.reducer;
