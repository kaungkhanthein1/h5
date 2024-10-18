import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthDetails {
  faceimg: string;
  nickname: string;
}

interface SocialAccounts {
  wx: object;
  qq: object;
  sina: object;
  google: {
    social_id: string;
    auth_details: AuthDetails;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  nickname: string;
  avatar: string;
  integral: number;
  active: number;
  level: string;
  inviter_id: number;
  invite_user_num: number;
  invite_code: string;
  social_accounts: SocialAccounts;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
