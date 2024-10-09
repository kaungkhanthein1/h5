import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

const SIGN_KEY = "635a580fcb5dc6e60caa39c31a7bde48";

export const PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA02F/kPg5A2NX4qZ5JSns+bjhVMCC6JbTiTKpbgNgiXU+Kkorg6Dj
76gS68gB8llhbUKCXjIdygnHPrxVHWfzmzisq9P9awmXBkCk74Skglx2LKHa/mNz
9ivg6YzQ5pQFUEWS0DfomGBXVtqvBlOXMCRxp69oWaMsnfjnBV+0J7vHbXzUIkqB
LdXSNfM9Ag5qdRDrJC3CqB65EJ3ARWVzZTTcXSdMW9i3qzEZPawPNPe5yPYbMZIo
XLcrqvEZnRK1oak67/ihf7iwPJqdc+68ZYEmmdqwunOvRdjq89fQMVelmqcRD9RY
e08v+xDxG9Co9z7hcXGTsUquMxkh29uNawIDAQAB
-----END RSA PUBLIC KEY-----`;

const API_URL_TEST = "https://cc3e497d.qdhgtch.com:2345/api/";
const AES_KEY = "e6d5de5fcc51f53d";
const AES_IV = "2f13eef7dfc6c613";

/**
 * Generate signature using HMAC MD5
 * @param {string} str
 * @returns {string}
 */
export function generateSignature(str: string): string {
  return CryptoJS.HmacMD5(str, SIGN_KEY).toString();
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
      CryptoJS.enc.Utf8.parse(AES_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(AES_IV),
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
