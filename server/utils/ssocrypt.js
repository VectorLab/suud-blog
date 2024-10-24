import crypto from 'crypto';
import ssoConfig from '../config/ssoConfig.js';

let ssoID = {};

const symDecrypt = async (key, iv, data) => {
  try {
    const impKey = await crypto.subtle.importKey("raw", key, "AES-GCM", true, ["decrypt"]);
    const decData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, impKey, data);
    return Buffer.from(decData);
  } catch (error) {
    console.error("Symmetric decryption error:", error);
    throw error;
  }
};

const asymPrivDecrypt = async (encData) => {
  if (!ssoID.pri) throw new Error("Private key not loaded");
  try {
    const decData = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, ssoID.pri, encData);
    return Buffer.from(decData);
  } catch (error) {
    console.error("Asymmetric decryption error:", error);
    throw error;
  }
};

export const ssoDecrypt = async (encData) => {
  try {
    const decHeader = await asymPrivDecrypt(encData.header);
    return await symDecrypt(decHeader.subarray(0, 32), decHeader.subarray(32, 44), encData.body);
  } catch (error) {
    console.error("SSO decryption error:", error);
    throw error;
  }
};

const loadSSO = async () => {
  const { SSO_PRIVATE_KEY, SSO_PASSWORD, SSO_SITE_ID } = ssoConfig;
  if (!SSO_PRIVATE_KEY || !SSO_PASSWORD || !SSO_SITE_ID) {
    throw new Error("Missing required SSO configuration");
  }

  ssoID = {
    pwd: Buffer.from(SSO_PASSWORD, "base64url"),
    pri: await crypto.subtle.importKey("pkcs8", Buffer.from(SSO_PRIVATE_KEY, "base64url"), 
      { name: "RSA-OAEP", hash: "SHA-256" }, true, ["decrypt"]),
    _id: Buffer.from(SSO_SITE_ID, "hex")
  };

  if (!ssoID.pri) throw new Error("Failed to import private key");
  console.log("SSO 配置加载成功");
};

let loaded = false;

export const checkLoad = async () => {
  if (loaded) return;
  try {
    await loadSSO();
    loaded = true;
  } catch (error) {
    console.error("SSO 配置加载失败:", error);
    throw error;
  }
};