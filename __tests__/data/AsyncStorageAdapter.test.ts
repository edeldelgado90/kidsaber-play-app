import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageAdapter } from '../../src/data/storage/AsyncStorageAdapter';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  jest.clearAllMocks();
  mockAsyncStorage.getItem.mockReset();
  mockAsyncStorage.setItem.mockReset();
  mockAsyncStorage.removeItem.mockReset();
});

const isString = (v: unknown): v is string => typeof v === 'string';

describe('AsyncStorageAdapter.get', () => {
  it('returns parsed value when key exists and passes validator', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify('hello'));
    const result = await AsyncStorageAdapter.get('key', isString);
    expect(result).toBe('hello');
  });

  it('returns null when key does not exist', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    const result = await AsyncStorageAdapter.get('key', isString);
    expect(result).toBeNull();
  });

  it('returns null when validator rejects the parsed data', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(42));
    const result = await AsyncStorageAdapter.get('key', isString);
    expect(result).toBeNull();
  });

  it('returns null when stored value is invalid JSON', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('{ bad json }');
    const result = await AsyncStorageAdapter.get('key', isString);
    expect(result).toBeNull();
  });

  it('returns null when AsyncStorage throws', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('storage error'));
    const result = await AsyncStorageAdapter.get('key', isString);
    expect(result).toBeNull();
  });
});

describe('AsyncStorageAdapter.set', () => {
  it('serializes value and calls setItem', async () => {
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    await AsyncStorageAdapter.set('myKey', { x: 1 });
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('myKey', JSON.stringify({ x: 1 }));
  });
});

describe('AsyncStorageAdapter.remove', () => {
  it('calls removeItem with the key', async () => {
    mockAsyncStorage.removeItem.mockResolvedValue(undefined);
    await AsyncStorageAdapter.remove('toDelete');
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('toDelete');
  });
});

describe('AsyncStorageAdapter.getString', () => {
  it('returns string value from storage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('raw-string');
    const result = await AsyncStorageAdapter.getString('key');
    expect(result).toBe('raw-string');
  });

  it('returns null when key not present', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    const result = await AsyncStorageAdapter.getString('key');
    expect(result).toBeNull();
  });
});

describe('AsyncStorageAdapter.setString', () => {
  it('calls setItem with raw string value', async () => {
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    await AsyncStorageAdapter.setString('k', 'raw');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('k', 'raw');
  });
});
