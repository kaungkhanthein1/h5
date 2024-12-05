import { createSlice } from "@reduxjs/toolkit";

const HomeSlice = createSlice({
  name: "home",
  initialState: {
    activeTab: 0,
    sort: "by_default",
    sortName: "综合",
    class: "类型",
    area: "地区",
    year: "年份",
    activeNav: 0,
    showFilterTag: false,
    isScrolling: false,
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
    setSortName: (state, { payload }) => {
      state.sortName = payload;
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
    setShowFilterTag: (state, { payload }) => {
      state.showFilterTag = payload;
    },
    setIsScrolling: (state, { payload }) => {
      state.isScrolling = payload;
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
  setShowFilterTag,
  setSortName,
  setIsScrolling,
} = HomeSlice.actions;
export default HomeSlice.reducer;
