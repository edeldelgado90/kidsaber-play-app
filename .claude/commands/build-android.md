# Build Android (EAS)

Triggers an EAS build for Android using the preview profile (produces an APK for internal testing).

Prerequisites:
1. Be logged in to Expo: `npx eas login`
2. Have `EXPO_PUBLIC_API_URL` set as an EAS secret: `npx eas secret:create --name EXPO_PUBLIC_API_URL --value <your-url>`

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && npx eas build --platform android --profile preview
```

Build profiles:
- `preview` — APK for internal testing (no store submission)
- `production` — AAB for Google Play submission

After the build completes, download the APK from expo.dev or install via `npx eas build:download`.
