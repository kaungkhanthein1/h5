import { createSlice } from "@reduxjs/toolkit";

const HomeSlice = createSlice({
  name: "home",
  initialState: {
    activeTab: 0,
    sort: "",
    class: "",
    area: "",
    year: "",
    activeNav: 0,
  },
  reducers: {
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    setActiveNav: (state, { payload }) => {
      state.activeNav = payload;
    },
    setSort: (state, { payload }) => {
      state.sort = payload;
    },
    setClass: (state, { payload }) => {
      state.class = payload;
    },
    setArea: (state, { payload }) => {
      state.area = payload;
    },
    setYear: (state, { payload }) => {
      state.year = payload;
    },
  },
});

export const {
  setActiveTab,
  setSort,
  setClass,
  setArea,
  setYear,
  setActiveNav,
} = HomeSlice.actions;
export default HomeSlice.reducer;
