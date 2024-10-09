import axios from "axios";
import {
  encryptWithRsa,
  generateSignature,
  decryptWithAes,
} from "./newEncryption";

const API_URL = "https://cc3e497d.qdhgtch.com:2345/api/";
const PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
  MIIBCgKCAQEA02F/kPg5A2NX4qZ5JSns+bjhVMCC6JbTiTKpbgNgiXU+Kkorg6Dj
  76gS68gB8llhbUKCXjIdygnHPrxVHWfzmzisq9P9awmXBkCk74Skglx2LKHa/mNz
  9ivg6YzQ5pQFUEWS0DfomGBXVtqvBlOXMCRxp69oWaMsnfjnBV+0J7vHbXzUIkqB
  LdXSNfM9Ag5qdRDrJC3CqB65EJ3ARWVzZTTcXSdMW9i3qzEZPawPNPe5yPYbMZIo
  XLcrqvEZnRK1oak67/ihf7iwPJqdc+68ZYEmmdqwunOvRdjq89fQMVelmqcRD9RY
  e08v+xDxG9Co9z7hcXGTsUquMxkh29uNawIDAQAB
  -----END RSA PUBLIC KEY-----`;
// GET request

/**
 * Fetch captcha image and key status
 * @returns {Promise<{captchaImage: string, keyStatus: string}>}
 */
export const getCaptcha = async () => {
  try {
    const response = await fetch(`${API_URL}v1/user/get_captcha`, {
      method: "GET",
    });

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
    // Step 1: Verify captcha
    const captchaResult = await fetch(`${API_URL}v1/user/check_captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: captchaCode,
        key: keyStatus,
      }),
    });

    const captchaResponse = await captchaResult.json();

    if (!captchaResponse.data) {
      throw new Error("Captcha verification failed");
    }

    const formData = {
      username,
      password,
      captcha: captchaResponse.data.key,
      timestamp: new Date().getTime(),
    };

    console.log("formData is=<", formData);
    // Step 2: Encrypt the data
    const encryptedData = encryptWithRsa(JSON.stringify(formData), PUBLIC_KEY);

    // Step 3: Generate signature
    const signature = generateSignature(encryptedData);

    // Step 4: Make the login API call
    const loginResponse = await fetch(`${API_URL}v1/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pack: encryptedData,
        signature,
      }),
    });

    const dataIsEncrypt = loginResponse.headers.get("x-app-data-encrypt");
    const resultText = await loginResponse.text();

    // Step 5: Handle the response (decrypt if needed)
    if (!dataIsEncrypt) {
      return JSON.parse(resultText);
    } else {
      return decryptWithAes(resultText);
    }
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
};

export const registerEmail = async (
  email: string,
  password: string,
  email_code: string
) => {
  const formData = {
    email,
    password,
    email_code,
    timestamp: new Date().getTime(),
  };
  const encryptedData = encryptWithRsa(JSON.stringify(formData), PUBLIC_KEY);

  const signature = generateSignature(encryptedData);

  console.log(formData);
  try {
    const response = await axios.post(
      "https://cc3e497d.qdhgtch.com:2345/api/v1/user/register/email",
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

    // Axios stores headers in an object, not a map, so access it like this
    const dataIsEncrypt = response.headers["x-app-data-encrypt"];

    // Handle the response
    const resultText = response.data; // Axios responses store data in the `data` property

    // If the data is encrypted, decrypt it; otherwise, return as is
    if (!dataIsEncrypt) {
      return resultText;
    } else {
      return decryptWithAes(resultText);
    }
  } catch (error: any) {
    console.error(
      "Error during registration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const registerPhone = async (
  phone: string,
  password: string,
  sms_code: string
) => {
  const formData = {
    phone,
    password,
    sms_code,
    timestamp: new Date().getTime(), // Add timestamp as in registerEmail
  };

  const encryptedData = encryptWithRsa(JSON.stringify(formData), PUBLIC_KEY); // Encrypt the data
  const signature = generateSignature(encryptedData); // Generate the signature

  console.log(formData);
  try {
    const response = await axios.post(
      "https://cc3e497d.qdhgtch.com:2345/api/v1/user/register/phone",
      {
        pack: encryptedData, // Encrypted data
        signature: signature, // Signature
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error during phone registration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOtp = async (
  captchaCode: string,
  keyStatus: string,
  sendTo: string, // This can be either email or phone
  sendType: "email" | "phone" // Specifies if it's for email or phone
): Promise<void> => {
  try {
    // Step 1: Verify Captcha
    const captchaResult = await axios.post(`${API_URL}v1/user/check_captcha`, {
      code: captchaCode,
      key: keyStatus,
    });

    const captchaResponse = captchaResult.data;

    if (!captchaResponse.data) {
      throw new Error("Captcha verification failed");
    }

    // Step 2: Prepare formData with required fields, using `sendType` to differentiate
    const formData = {
      send_type: sendType, // Set as "email" or "phone"
      to: sendTo, // The value will be either an email or a phone number
      captcha: captchaResponse.data.key,
      timestamp: new Date().getTime(), // Add timestamp for extra security
    };

    console.log(formData);

    // Step 3: Encrypt the data
    const encryptedData = encryptWithRsa(JSON.stringify(formData), PUBLIC_KEY);

    // Step 4: Generate signature for the encrypted data
    const signature = generateSignature(encryptedData);

    // Step 5: Make the GET request with encrypted data and signature as query parameters
    const otpResponse = await axios.get(`${API_URL}v1/user/get_code`, {
      params: {
        pack: encryptedData,
        signature: signature,
      },
    });

    console.log("OTP Request successful:", otpResponse.data);
  } catch (error) {
    console.error("Error requesting OTP:", error);
  }
};
