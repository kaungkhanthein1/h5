import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface model {
  openAuthModel: boolean;
  openLoginModel: boolean;
  openSignupModel: boolean;
  openCaptcha: boolean;
  openOtp: boolean;
  captchaCode: string;
  captchaKey: string;
  openSignUpEmailModel: boolean;
  openSignUpPhoneModel: boolean;
  social_id: string;
  openUserNameForm : boolean,
  panding : number
  GraphicKey : string
}

const initialState: model = {
  openAuthModel: false,
  openLoginModel: false,
  openSignupModel: false,
  openCaptcha: false,
  openOtp: false,
  captchaCode: "",
  captchaKey: "",
  openSignUpEmailModel: false,
  openSignUpPhoneModel: false,
  openUserNameForm: false,
  social_id: "",
  panding : 0,
  GraphicKey : ''
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setAuthModel: (state, action) => {
      state.openAuthModel = action.payload;
    },
    setLoginOpen: (state, action) => {
      state.openLoginModel = action.payload;
    },
    setSignupOpen: (state, action) => {
      state.openSignupModel = action.payload;
    },
    setCaptchaOpen: (state, action) => {
      state.openCaptcha = action.payload;
    },
    setOtpOpen: (state, action) => {
      state.openOtp = action.payload;
    },
    setCapCode: (state, action) => {
      state.captchaCode = action.payload;
    },
    setOCapKey: (state, action) => {
      state.captchaKey = action.payload;
    },
    setSignUpEmail: (state, action) => {
      //no need
      state.openSignUpEmailModel = action.payload;
    },
    setSignUpPhone: (state, action) => {
      //no need
      state.openSignUpPhoneModel = action.payload;
    },
    setOpenUserNameForm: (state, action) => {
      //no need
      state.openUserNameForm = action.payload;
    },
    setSocial_id: (state, action) => {
      state.social_id = action.payload;
    },
    setGraphicKey: (state, action) => {
      state.GraphicKey = action.payload;
    },
    setPanding: (state, action) => {            //no need
    state.panding = action.payload;
    },
  }
});

export const {
  setLoginOpen,
  setSignupOpen,
  setCaptchaOpen,
  setAuthModel,
  setOtpOpen,
  setCapCode,
  setOCapKey,
  setSignUpEmail,
  setSignUpPhone,
  setOpenUserNameForm,
  setSocial_id,
  setGraphicKey,
  setPanding
} = modelSlice.actions;

export default modelSlice.reducer;
