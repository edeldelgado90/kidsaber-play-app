# Start Dev Server

Starts the Expo development server with the correct environment variables.

Prerequisites:

1. Copy `.env.example` to `.env` and fill in `EXPO_PUBLIC_API_URL`
2. Run `npm install` if you haven't already

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && npx expo start
```

Options:

- Press `a` to open on Android emulator
- Press `w` to open in browser (web)
- Scan QR code with Expo Go app on physical device

To start with a specific platform:

- Android: `npx expo start --android`
- Web: `npx expo start --web`
- iOS: `npx expo start --ios`
