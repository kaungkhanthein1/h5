// src/features/navbar/navbarSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteItem {
  id: string;
}

interface FavoriteState {
  data: FavoriteItem[];
}

const initialState: FavoriteState = {
  data: [],
};

export const FavoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    setFavData: (state, action: PayloadAction<FavoriteItem>) => {
      const newData = action.payload;
      const existingDataIndex = state.data.findIndex(
        (item) => item.id === newData.id
      );
      if (existingDataIndex === -1) {
        // Add to favorites
        state.data = [...state.data, newData];
      } else {
        // Remove from favorites
        state.data = state.data.filter((item) => item.id !== newData.id);
      }
    },
    deleteFavData: (state, action: PayloadAction<string[]>) => {
      // Remove all movies whose IDs are in the action.payload array
      state.data = state.data.filter(
        (item) => !action.payload.includes(item.id)
      );
    },
  },
});

// Actions generated from the slice
export const { setFavData, deleteFavData } = FavoriteSlice.actions;

// A selector to get the favorite data from the state
export const selectFavData = (state: { favorite: FavoriteState }) =>
  state.favorite.data;

// The reducer
export default FavoriteSlice.reducer;
