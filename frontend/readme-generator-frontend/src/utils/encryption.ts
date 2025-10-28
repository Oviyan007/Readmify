// utils/encryption.ts
import CryptoJS from 'crypto-js';

// Use a consistent secret key for encryption
// In production, consider storing in environment variables
const SECRET_KEY = 'elevate-readme-ai-secret-key-2025';

export const encryptApiKey = (apiKey: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(apiKey, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
};
