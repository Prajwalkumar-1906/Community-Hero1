// Virtual Secure Database Engine using Encrypted LocalStorage
// Implements secure serialization and cryptography shift routines

const SECRET_KEY = "COMMUNITY_HERO_SECURE_SALT_2026";

// Simple yet robust XOR shift cipher for hackathon simulation demonstration
// Encrypts character strings into hex codes to avoid storage encoding corruption
export const encrypt = (text) => {
  if (typeof text !== "string") {
    text = JSON.stringify(text);
  }
  
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    // XOR operation
    const encryptedChar = charCode ^ keyChar;
    // Pad with leading zeros if hex code is small
    result += encryptedChar.toString(16).padStart(4, "0");
  }
  return result;
};

export const decrypt = (cipherText) => {
  if (!cipherText) return null;
  try {
    let decrypted = "";
    for (let i = 0; i < cipherText.length; i += 4) {
      const hexChunk = cipherText.substring(i, i + 4);
      const encryptedChar = parseInt(hexChunk, 16);
      const keyChar = SECRET_KEY.charCodeAt((i / 4) % SECRET_KEY.length);
      const decryptedChar = encryptedChar ^ keyChar;
      decrypted += String.fromCharCode(decryptedChar);
    }
    
    // Parse if JSON, otherwise return text
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (err) {
    console.error("Decryption failure - data corrupt or keys rotated", err);
    return null;
  }
};

export const dbEngine = {
  save: (key, data) => {
    try {
      const encryptedData = encrypt(data);
      window.localStorage.setItem(`ch_db_${key}`, encryptedData);
      return true;
    } catch (err) {
      console.error("Local Database write error", err);
      return false;
    }
  },

  load: (key, fallback) => {
    try {
      const rawStored = window.localStorage.getItem(`ch_db_${key}`);
      if (!rawStored) {
        // Seed if missing
        dbEngine.save(key, fallback);
        return fallback;
      }
      const decrypted = decrypt(rawStored);
      return decrypted || fallback;
    } catch (err) {
      console.error("Local Database read error", err);
      return fallback;
    }
  },

  getRawCipher: (key) => {
    return window.localStorage.getItem(`ch_db_${key}`) || "";
  },

  clear: (key) => {
    window.localStorage.removeItem(`ch_db_${key}`);
  }
};
