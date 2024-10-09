import { createSlice } from '@reduxjs/toolkit';

interface PlayerState {
  selectedGroup: string;
}

const initialState: PlayerState = {
  selectedGroup: '1-50 集',
};

export const playerSlice = createSlice({
  name: 'episode',
  initialState,
  reducers: {
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
  },
});

export const { setSelectedGroup } = playerSlice.actions;

export default playerSlice.reducer;
