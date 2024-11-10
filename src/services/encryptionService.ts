import CryptoJS from "crypto-js";
import forge from "node-forge";

// Function to generate signature (MD5 HMAC)
export function generateSignature(str: string): string {
  const signKey = process.env.REACT_APP_SIGN_KEY;
  if (!signKey) {
    throw new Error("REACT_APP_SIGN_KEY is not defined");
  }
  return CryptoJS.HmacMD5(str, signKey).toString();
}

// RSA encryption using a public key
export function encryptWithRsa(
  data: string,
  key: string = process.env.REACT_APP_PUBLIC_KEY || ""
): string {
  const publicKey = forge.pki.publicKeyFromPem(key);
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(data), "RSA-OAEP");
  return urlSafeB64encode(forge.util.encode64(encrypted));
}

// RSA decryption function
export function decryptWithRsa(
  encryptedData: string,
  privateKey: string
): string {
  const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
  const decodedData = forge.util.decode64(urlSafeB64decode(encryptedData));
  const decrypted = privateKeyObj.decrypt(decodedData, "RSA-OAEP");
  return forge.util.decodeUtf8(decrypted);
}

// AES decryption function
export function decryptWithAes(data: string): object | null {
  const aesKey = process.env.REACT_APP_AES_KEY;
  const aesIv = process.env.REACT_APP_AES_IV;

  if (!aesKey || !aesIv) {
    throw new Error("REACT_APP_AES_KEY or REACT_APP_AES_IV is not defined");
  }

  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const iv = CryptoJS.enc.Utf8.parse(aesIv);

  try {
    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}

// URL-safe base64 encoding
export function urlSafeB64encode(data: string): string {
  return data.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// URL-safe base64 decoding
export function urlSafeB64decode(data: string): string {
  return data.replace(/-/g, "+").replace(/_/g, "/");
}
