import { createSlice } from "@reduxjs/toolkit";

const ExploreSlice = createSlice({
  name: "explore",
  initialState: {
    activeTab: 1,
    sort: "by_default",
    sortName: "综合",
    class: "类型",
    area: "地区",
    year: "年份",
    activeNav: "",
    activeRank: "",
    activeWeek: null,
  },
  reducers: {
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    setActiveNav: (state, { payload }) => {
      state.activeNav = payload;
    },
    setActiveRank: (state, { payload }) => {
      state.activeRank = payload;
    },
    setActiveWeek: (state, { payload }) => {
      state.activeWeek = payload;
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
  },
});

export const {
  setActiveTab,
  setSort,
  setClass,
  setArea,
  setYear,
  setActiveNav,
  setActiveRank,
  setActiveWeek,
  setSortName,
} = ExploreSlice.actions;
export default ExploreSlice.reducer;
