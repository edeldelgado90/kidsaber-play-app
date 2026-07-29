/**
 * AppInfo reads its values once at module load, so each case re-imports the
 * module inside jest.isolateModules with its own mocks. The mocks go through
 * jest.doMock rather than jest.mock because isolateModules builds a fresh
 * registry — a mock instance created outside it is a different object.
 */

type Natives = {
  nativeApplicationVersion: string | null;
  nativeBuildVersion: string | null;
};

/** Web and Expo Go: expo-application reports nothing. */
const WEB_NATIVES: Natives = { nativeApplicationVersion: null, nativeBuildVersion: null };

function loadAppInfo(natives: Natives = WEB_NATIVES) {
  let loaded: typeof import('@/infrastructure/config/appInfo').AppInfo | undefined;

  jest.isolateModules(() => {
    jest.doMock('expo-application', () => natives);
    jest.doMock('expo-constants', () => ({
      __esModule: true,
      default: { expoConfig: { version: '1.0.0' } },
    }));
    loaded = require('@/infrastructure/config/appInfo').AppInfo;
  });

  if (!loaded) throw new Error('appInfo did not load inside jest.isolateModules');
  return loaded;
}

afterEach(() => {
  delete process.env.EXPO_PUBLIC_SUPPORT_EMAIL;
});

describe('AppInfo — version label', () => {
  it('combines version and build number on a native build', () => {
    const info = loadAppInfo({ nativeApplicationVersion: '1.2.0', nativeBuildVersion: '42' });

    expect(info.version).toBe('1.2.0');
    expect(info.buildNumber).toBe('42');
    expect(info.versionLabel).toBe('1.2.0 (42)');
  });

  it('falls back to the app.json version on web, where natives are null', () => {
    const info = loadAppInfo();

    expect(info.version).toBe('1.0.0');
    expect(info.buildNumber).toBeNull();
    expect(info.versionLabel).toBe('1.0.0');
  });
});

describe('AppInfo — support email', () => {
  it('exposes the configured address', () => {
    process.env.EXPO_PUBLIC_SUPPORT_EMAIL = 'hola@example.com';

    expect(loadAppInfo().supportEmail).toBe('hola@example.com');
  });

  it('is empty when the env var is unset, so the contact row can be hidden', () => {
    expect(loadAppInfo().supportEmail).toBe('');
  });
});
