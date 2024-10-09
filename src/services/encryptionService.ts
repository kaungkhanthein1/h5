import CryptoJS from "crypto-js";
import forge from "node-forge";

const SIGN_KEY = "635a580fcb5dc6e60caa39c31a7bde48";
const PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA02F/kPg5A2NX4qZ5JSns+bjhVMCC6JbTiTKpbgNgiXU+Kkorg6Dj
76gS68gB8llhbUKCXjIdygnHPrxVHWfzmzisq9P9awmXBkCk74Skglx2LKHa/mNz
9ivg6YzQ5pQFUEWS0DfomGBXVtqvBlOXMCRxp69oWaMsnfjnBV+0J7vHbXzUIkqB
LdXSNfM9Ag5qdRDrJC3CqB65EJ3ARWVzZTTcXSdMW9i3qzEZPawPNPe5yPYbMZIo
XLcrqvEZnRK1oak67/ihf7iwPJqdc+68ZYEmmdqwunOvRdjq89fQMVelmqcRD9RY
e08v+xDxG9Co9z7hcXGTsUquMxkh29uNawIDAQAB
-----END RSA PUBLIC KEY-----`;

const AES_KEY = "e6d5de5fcc51f53d";
const AES_IV = "2f13eef7dfc6c613";

// Function to generate signature (MD5 HMAC)
export function generateSignature(str: string): string {
  return CryptoJS.HmacMD5(str, SIGN_KEY).toString();
}

// RSA encryption using a public key
export function encryptWithRsa(data: string, key: string = PUBLIC_KEY): string {
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
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const iv = CryptoJS.enc.Utf8.parse(AES_IV);

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
