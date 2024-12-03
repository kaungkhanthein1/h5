import axios from "axios";
import {
  encryptWithRsa,
  generateSignature,
  decryptWithAes,
  convertToSecureUrl,
  convertToSecurePayload,
} from "./newEncryption";

// GET request

/**
 * Fetch captcha image and key status
 * @returns {Promise<{captchaImage: string, keyStatus: string}>}
 */
export const getCaptcha = async () => {
  try {
    const response = await fetch(
      convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/get_captcha`),
      {
        method: "GET",
      }
    );

    const captchaData = await response.json();

    if (captchaData && captchaData.data) {
      return {
        captchaImage: captchaData.data.base64,
        keyStatus: captchaData.data.key,
      };
    } else {
      throw new Error("Failed to fetch captcha data");
    }
  } catch (err) {
    console.error("Error fetching captcha:", err);
    throw err;
  }
};

/**
 * Login function
 * @param {string} username
 * @param {string} password
 * @param {string} captchaCode
 * @param {string} keyStatus
 * @returns {Promise<object>}
 */

export const login = async (
  username: string,
  password: string,
  captchaCode: string,
  keyStatus: string
) => {
  try {
    const gg = convertToSecurePayload({
      code: captchaCode,
      key: keyStatus,
      timestamp: new Date().getTime(),
    });
    // const captchaResult = await fetch(
    //   convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/check_captcha`),
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: gg
    //   }
    // );

    const captchaResult = await axios.post(
      convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/check_captcha`),
      gg
    );
    // console.log(captchaResult)

    const captchaResponse = await captchaResult.data;
    let newCap: { data?: any } = decryptWithAes(captchaResponse) || {};

    if (!newCap.data) {
      throw new Error("Captcha verification failed");
    }

    const formData = {
      username,
      password,
      captcha: newCap.data.key,
      timestamp: new Date().getTime(),
    };

    // Step 2: Encrypt the data
    if (!process.env.REACT_APP_PUBLIC_KEY) {
      throw new Error("Public key is not defined");
    }
    if (!process.env.REACT_APP_PUBLIC_KEY) {
      throw new Error("Public key is not defined");
    }
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("Public key is not defined");
    }
    const encryptedData = encryptWithRsa(JSON.stringify(formData), publicKey);
    const ll = convertToSecurePayload(formData);

    // Step 3: Generate signature
    const signature = generateSignature(encryptedData);

    // Step 4: Make the login API call
    // const loginResponse = await fetch(
    //   convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/login`),
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: ll
    //   }
    // );

    const loginResponse = await axios.post(
      convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/login`),
      ll
    );

    const dataIsEncrypt = loginResponse.headers;
    // const dataIsEncrypt = loginResponse.headers["x-app-data-encrypt"];

    console.log(dataIsEncrypt, "gg");

    const resultText = await loginResponse.data;
    // console.log(resultText)

    // Step 5: Handle the response (decrypt if needed)
    if (!dataIsEncrypt) {
      return JSON.parse(resultText);
    } else {
      return decryptWithAes(resultText);
    }
  } catch (err) {
    // console.error("Error during login:", err);
    throw err;
  }
};

export const signup = async ({ email, password, email_code }: any) => {
  try {
    let bd = convertToSecurePayload({
      email,
      password,
      email_code,
      timestamp: new Date().getTime(),
    });
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/register/email`,
      bd
    );
    return decryptWithAes(data);
  } catch (error) {
    // console.log('error during email', error)
    throw error;
  }
};

export const signupPh = async ({ phone, password, sms_code }: any) => {
  try {
    let bd = convertToSecurePayload({
      phone,
      password,
      sms_code,
      timestamp: new Date().getTime(),
    });
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/register/phone`,
      bd
    );
    return decryptWithAes(data);
  } catch (error) {
    // console.log('error during email', error)
    throw error;
  }
};

export const getTokenPass = async ({ email, graphicKey }: any) => {
  try {
    const { data } = await axios.get(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}/user/forget/get_token?username=${email}&captcha=${graphicKey}`
      )
    );
    console.log(data);
    return decryptWithAes(data);
  } catch (error) {
    throw error;
    console.log(error);
  }
};

export const getCodeForgotPass = async ({ send_type, session_token }: any) => {
  try {
    const { data } = await axios.get(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}/user/forget/send_code?send_type=${send_type}&session_token=${session_token}`
      )
    );
    // console.log(data)
  } catch (error) {
    throw error
  }
};

export const check_captchaRegister = async (
  captchaCode: string,
  keyStatus: string
) => {
  try {
    const gg = convertToSecurePayload({
      code: captchaCode,
      key: keyStatus,
      timestamp: new Date().getTime(),
    });

    const captchaResult = await axios.post(
      convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/check_captcha`),
      gg
    );
    const captchaResponse = captchaResult.data;

    let newCap: { data?: any } = decryptWithAes(captchaResponse) || {};

    if (!newCap.data) {
      throw new Error("Captcha verification failed");
    }
    return newCap.data.key;
  } catch (error) {
    console.log("cap err", error);
    return error;
  }
};

export const getOtp = async (
  // captchaCode: string,
  // keyStatus: string,
  key: string,
  sendTo: string, // This can be either email or phone
  sendType: "email" | "phone" // Specifies if it's for email or phone
): Promise<void> => {
  try {
    const formData = {
      send_type: sendType, // Set as "email" or "phone"
      to: sendTo, // The value will be either an email or a phone number
      captcha: key,
      timestamp: new Date().getTime(), // Add timestamp for extra security
    };
    // console.log(formData);

    // Step 3: Encrypt the data
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("Public key is not defined");
    }
    // const encryptedData = encryptWithRsa(JSON.stringify(formData), publicKey);
    const cc = convertToSecurePayload(formData);

    // Step 4: Generate signature for the encrypted data
    // const signature = generateSignature(encryptedData);

    // Step 5: Make the GET request with encrypted data and signature as query parameters
    const otpResponse = await axios.get(
      convertToSecureUrl(
        `${
          process.env.REACT_APP_API_URL
        }/user/get_code?send_type=${sendType}&to=${sendTo}&captcha=${key}&timestamp=${new Date().getTime()}`
      )
      // {
      //   params: {
      //     formData
      //   },
      // }
    );
    // console.log(otpResponse);
  } catch (error: any) {
    // console.error("Error requesting OTP:", error);
    return error.response;
  }
};

export const getSocialLoginUrl = async (type: string, action: string) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/get_social_login_url`,
      {
        params: {
          type: type,
          action: action,
        },
        headers: {
          "X-Action-Type": "your-action-type",
          "X-Client-Setting": "your-client-settings",
          "X-App-Version": "1000", // Example of version
          "X-App-Lang": "zh_CN", // Or 'en'
        },
      }
    );

    // Handle the response
    return response.data;
  } catch (error) {
    console.error("Error fetching social login URL:", error);
    throw error;
  }
};
export const handleSocialLoginCallback = async (
  type: string,
  action: string,
  code: string
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/social_login_callback`,
      {
        action: action, // e.g., "login"
        type: type, // e.g., "qq", "wx", "sina"
        code: code, // The code you get from the redirect
      },
      {
        headers: {
          "X-Action-Type": "your-action-type",
          "X-Client-Setting": "your-client-settings",
          "X-App-Version": "1000",
          "X-App-Lang": "zh_CN",
        },
      }
    );

    // Handle the success response, maybe store the tokens
    if (response.data) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error handling social login callback", error);
    // alert("Failed to complete social login. Please try again.");
  }
};

export const handleSocialLoginCredentials = async (
  captchaCode: string,
  keyStatus: string,
  username: string,
  password: string,
  // repassword:string,
  platform_type: string,
  social_id: string
) => {
  try {
    const captchaResult = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/check_captcha`,
      {
        code: captchaCode,
        key: keyStatus,
      }
    );

    const captchaResponse = captchaResult.data;

    if (!captchaResponse.data) {
      throw new Error("Captcha verification failed");
    }

    const formData = {
      username: username,
      password: password,
      // repassword:repassword,
      platform_type: platform_type,
      social_id: social_id,
      captcha: captchaResponse.data.key,
      timestamp: new Date().getTime(),
    };

    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("Public key is not defined");
    }
    const encryptedData = encryptWithRsa(JSON.stringify(formData), publicKey);

    const signature = generateSignature(encryptedData);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/bind_social_with_credentials`,
      {
        pack: encryptedData,
        signature: signature,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {}
};

export const handleSocialSignUpCredentials = async (
  captchaCode: string,
  keyStatus: string,
  username: string,
  password: string,
  repassword: string,
  platform_type: string,
  social_id: string
) => {
  try {
    const captchaResult = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/check_captcha`,
      {
        code: captchaCode,
        key: keyStatus,
      }
    );

    const captchaResponse = captchaResult.data;

    if (!captchaResponse.data) {
      throw new Error("Captcha verification failed");
    }

    const formData = {
      username,
      password,
      repassword,
      platform_type,
      social_id,
      captcha: captchaResponse.data.key,
      timestamp: new Date().getTime(),
    };

    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("Public key is not defined");
    }
    const encryptedData = encryptWithRsa(JSON.stringify(formData), publicKey);
    const signature = generateSignature(encryptedData);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/register/social`,
      {
        pack: encryptedData,
        signature,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during social sign up:", error);
  }
};
