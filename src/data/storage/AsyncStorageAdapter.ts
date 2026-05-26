import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Typed wrapper around AsyncStorage.
 * Handles JSON serialization/deserialization and validates shapes on read.
 * Never assume stored data is valid — it could be from an old schema version or corrupted.
 */
export const AsyncStorageAdapter = {
  /**
   * Reads and parses a JSON item from AsyncStorage.
   * Returns null if the key doesn't exist or the data is invalid.
   */
  async get<T>(key: string, validate: (data: unknown) => data is T): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;

      const parsed = JSON.parse(raw) as unknown;
      if (!validate(parsed)) {
        // Data doesn't match expected shape (maybe old schema) — treat as missing
        return null;
      }
      return parsed;
    } catch {
      // JSON parse error or storage error — treat as missing
      return null;
    }
  },

  /**
   * Serializes and stores a value to AsyncStorage.
   */
  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Removes an item from AsyncStorage.
   */
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Reads a raw string value from AsyncStorage.
   */
  async getString(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  /**
   * Sets a raw string value in AsyncStorage.
   */
  async setString(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
};
