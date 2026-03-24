# Cat-Safe Plant Dictionary UI

This is a code bundle for Cat-Safe Plant Dictionary UI. The original project is available at https://www.figma.com/design/Yng7wtC7jBBnV1DG72341M/Cat-Safe-Plant-Dictionary-UI.

## Running the code

```bash
cd expo-app
npm i
npm start
```

Or from project root:
```bash
npm run dev
```

## Development

- **Lint**: `npm run lint` — Run ESLint
- **Format**: `npm run format` — Format code with Prettier
- **Test**: `npm test` — Run unit tests (data layer)

## Deployment / Submission

### TestFlight iOS submission

#### Prerequisites

1. Register the app in [App Store Connect](https://appstoreconnect.apple.com).
   - Create a new app from **My Apps**.
   - Bundle ID must match `expo-app/app.json` (currently `com.catsafeplant.dictionary`).
2. Find your `ascAppId` (Apple ID number).
   - App Store Connect -> App -> **General** -> **App Information** -> **Apple ID**.

#### Configure `eas.json`

Add `ascAppId` under `submit.production.ios`:

```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "YOUR_APPLE_ID_NUMBER"
    }
  }
}
```

#### Submit command

From project root:

```bash
npm run submit:ios
```

Or run directly:

```bash
cd expo-app
npx eas-cli submit --platform ios --profile production --latest
```

#### Notes

- On first run, sign in with your Apple ID.
- You may need an app-specific password from [appleid.apple.com](https://appleid.apple.com) -> Sign-In and Security -> App-Specific Passwords.
  