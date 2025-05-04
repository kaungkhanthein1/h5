// features/movie/movieSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MovieState {
  movieData: any[];
  page2: number;
  scrollPosition: number;
}

const initialState: MovieState = {
  movieData: [],
  page2: 2,
  scrollPosition: 0,
};

export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setMovieData: (state, action: PayloadAction<any[]>) => {
      state.movieData = action.payload;
    },
    setPage2: (state, action: PayloadAction<number>) => {
      state.page2 = action.payload;
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
    appendMovieData: (state, action: PayloadAction<any[]>) => {
      state.movieData = [...state.movieData, ...action.payload];
    },
    resetMovieState: () => initialState,
  },
});

export const {
  setMovieData,
  setPage2,
  setScrollPosition,
  appendMovieData,
  resetMovieState,
} = movieSlice.actions;

export default movieSlice.reducer;
