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
export function decryptWithAes(data: string): object | null {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      data,
      CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_KEY || ""),
      {
        iv: CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_IV || ""),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}

/**
 * URL-safe base64 decoding
 * @param {string} data - The URL-safe base64 encoded data
 * @return {string} - The decoded string
 */
export function urlSafeB64decode(data: string): string {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return base64;
}
