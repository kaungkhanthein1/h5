export interface SignUpEmailArgs {
  email: string;
  password: string;
  email_code: string;
}

export interface SignUpPhoneArgs {
  phone: string;
  password: string;
  sms_code: string;
}
export interface ConfirmArgs {
  captchaCode: string;
  keyStatus: string;
}
export interface SignUpResponse {
  data: any;
  msg: string;
}

export interface comfirmResponse {
  data: any;
  msg: string;
  key: string;
}

export interface GetTokenArgs {
  email: string;
  graphicKey: string;
}

export interface GetTokenResponse {
  token: string;
  msg: string;
  data: any;
}

export interface GetCodeArgs {
    send_type: string;
    session_token: string;
  }
  
  export interface GetTCodeResponse {
    // token: string;
    msg: string;
    data: any;
  }

  export interface RecoverPassArgs{
    password: string;
    repassword: string;
    session_token: string;
    forget_code: string;
  }

  export interface RecoverPassResponse{
    msg: string;
    data: any;
  }
  