import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

/**
 * Generate signature using HMAC MD5
 * @param {string} str
 * @returns {string}
 */
export function generateSignature(str: string): string {
  const signKey = process.env.REACT_APP_SIGN_KEY;
  if (!signKey) {
    throw new Error("REACT_APP_SIGN_KEY is not defined.");
  }
  return CryptoJS.HmacMD5(str, signKey).toString();
}

/**
 * RSA encryption using `jsencrypt`
 * @param {string} data - The data to encrypt
 * @param {string} key - The RSA public key
 * @return {string} - The encrypted data in URL-safe base64 encoding
 */
export function encryptWithRsa(data: string, key: string): string {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(key);
  const encrypted = encrypt.encrypt(data);
  if (!encrypted) {
    throw new Error("RSA encryption failed.");
  }
  return urlSafeB64encode(encrypted);
}

/**
 * URL-safe base64 encoding
 * @param {string} data - The base64 encoded data
 * @return {string} - URL-safe base64 encoded data
 */
export function urlSafeB64encode(data: string): string {
  return data.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * AES decryption using `crypto-js`
 * @param {string} data - The data to decrypt
 * @return {object | null} - The decrypted data as a JSON object, or null if decryption fails
 */
// export function decryptWithAes(data: string): object | null {
//   try {
//     const decrypted = CryptoJS.AES.decrypt(
//       data,
//       CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_KEY || ""),
//       {
//         iv: CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_IV || ""),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       }
//     );
//     const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decryptedStr);
//   } catch (err) {
//     console.error("Decryption error:", err);
//     return null;
//   }
// }
// import CryptoJS from "crypto-js";

export function decryptWithAes(data: string): object | null {
  try {
    // Decode the encrypted data (if URL-safe base64 encoding was used)
    const encryptedData = data.replace(/-/g, "+").replace(/_/g, "/"); // Convert URL-safe base64 to standard base64

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_KEY || ""),
      {
        iv: CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_IV || ""),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // Convert decrypted data to string
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    // Parse the JSON string to an object
    return JSON.parse(decryptedStr);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}

export function urlSafeB64decode(data: string): string {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return base64;
}

function convertUrlToFormData(url: string): Record<string, any> {
  const params: any = new URLSearchParams(url);
  const formData: Record<string, any> = { timestamp: new Date().getTime() };

  for (const [key, value] of params.entries()) {
    formData[key] = isNaN(value as any) ? value : Number(value); // Convert numeric strings to numbers
  }

  return formData;
}

function createSecureUrl(base: string, formData: Record<string, any>): string {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error("Public key is not defined");
  }

  const encrypted = encryptWithRsa(JSON.stringify(formData), publicKey);
  const signature = generateSignature(encrypted);

  return `${base}?pack=${encodeURIComponent(
    encrypted
  )}&signature=${encodeURIComponent(signature)}`;
}

export function convertToSecureUrl(apiUrl: string): string {
  const [base, query] = apiUrl.split("?", 2); // Split URL into base and query string
  const formData = query
    ? convertUrlToFormData(query)
    : { timestamp: new Date().getTime() };

  return createSecureUrl(base, formData);
}

export function convertToSecurePayload(formData: any): any {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("Public key is not defined");
  }

  formData["timestamp"] = new Date().getTime();
  const encrypted = encryptWithRsa(JSON.stringify(formData), publicKey);
  const signature = generateSignature(encrypted);
  return {
    pack: encrypted,
    signature: signature,
  };
}
