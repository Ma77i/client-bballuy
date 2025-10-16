import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  SESSION: 'auth_session',
  USER_ID: 'auth_user_id',
} as const;

async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const secureStorage = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return await getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return await getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async saveSession(session: string): Promise<void> {
    await setSecureItem(STORAGE_KEYS.SESSION, session);
  },

  async getSession(): Promise<string | null> {
    return await getSecureItem(STORAGE_KEYS.SESSION);
  },

  async saveUserId(userId: string): Promise<void> {
    await setSecureItem(STORAGE_KEYS.USER_ID, userId);
  },

  async getUserId(): Promise<string | null> {
    return await getSecureItem(STORAGE_KEYS.USER_ID);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      deleteSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
      deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
      deleteSecureItem(STORAGE_KEYS.SESSION),
      deleteSecureItem(STORAGE_KEYS.USER_ID),
    ]);
  },
};
