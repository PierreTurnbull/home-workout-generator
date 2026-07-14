# Google Play release guide

This project ships to Google Play as a Capacitor Android app. The web app is bundled inside the AAB, so the Play Store build does not depend on GitHub Pages.

## What is already set up

- Capacitor Android project in `android/`
- App ID: `com.pierreturnbull.homeworkoutgenerator`
- Store listing copy in `store-listing/`
- Data safety answers in `store-listing/data-safety.md`
- Privacy policy: https://pierreturnbull.github.io/home-workout-generator/privacy-policy.html
- Release signing hooks in `android/app/build.gradle`

## Quick path to your first upload

### 1. One-time setup

```bash
brew install --cask temurin@21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

Install [Android Studio](https://developer.android.com/studio) if you have not already, then open the project once:

```bash
npm install
npm run android:open
```

Create a [Google Play developer account](https://play.google.com/console) ($25 one-time).

### 2. Create signing key

```bash
chmod +x scripts/android-setup-signing.sh scripts/android-env-check.sh
npm run android:setup-signing
```

This creates:

- `android/home-workout-generator-release.keystore`
- `android/keystore.properties`

Keep the keystore and passwords safe. Google requires the same signing key for all future updates.

### 3. Build the release bundle

```bash
npm run android:check
npm run android:bundle
```

Upload file:

`android/app/build/outputs/bundle/release/app-release.aab`

### 4. Test on a device first (recommended)

```bash
npm run android:run
```

## Play Console setup

### Create the app

1. Open [Play Console](https://play.google.com/console)
2. **Create app**
3. App name: `Home Workout Generator`
4. Default language: English (United States)
5. App or game: App
6. Free or paid: Free

### Store listing

Use the ready-made copy in `store-listing/`:

| Field | File |
|---|---|
| App name | `store-listing/en-US/title.txt` |
| Short description | `store-listing/en-US/short-description.txt` |
| Full description | `store-listing/en-US/full-description.txt` |
| French listing | `store-listing/fr-FR/` |

You still need to upload:

- **App icon** — `public/pwa-512.png` (512×512)
- **Feature graphic** — 1024×500 image for the store header
- **Phone screenshots** — at least 2 (take from emulator or device)

Screenshot tip: run the app in Android Studio emulator, capture Build, History, and Running screens.

### App content

| Section | Answer |
|---|---|
| Privacy policy | https://pierreturnbull.github.io/home-workout-generator/privacy-policy.html |
| Ads | No |
| App access | All functionality available without restrictions |
| Content rating | Complete the questionnaire (fitness app, no sensitive content) |
| Target audience | 13+ / general audience |
| Data safety | See `store-listing/data-safety.md` |
| Government apps | No |
| Financial features | No |

### Release

1. Go to **Testing → Internal testing** for your first upload
2. Create a new release
3. Upload `app-release.aab`
4. Add release notes, for example: `Initial release.`
5. Review and roll out to internal testers
6. After testing, promote to **Production**

Package name must match the bundle:

`com.pierreturnbull.homeworkoutgenerator`

## Useful commands

```bash
npm run android:check          # verify Java 21, SDK, signing files
npm run android:setup-signing    # create keystore + keystore.properties
npm run build:android          # build web app + sync into android/
npm run android:open           # open project in Android Studio
npm run android:run            # build and run on device/emulator
npm run android:bundle         # build signed release AAB
npm run android:icons          # regenerate launcher icons
```

## Updating later

Release notes templates live in `store-listing/en-US/release-notes.txt` and `store-listing/fr-FR/release-notes.txt`.

1. Bump `versionCode` and `versionName` in `android/app/build.gradle`
2. Update release notes in `store-listing/`
3. Run `npm run android:check` then `npm run android:bundle`
4. Upload `android/app/build/outputs/bundle/release/app-release.aab` to Play Console
5. Paste release notes, review, and start rollout

## Notes

- GitHub Pages deploy uses `BASE_PATH=/home-workout-generator/`
- Android builds use web base path `/`
- Workout history stays on-device via `localStorage`
- CI verifies Android debug builds on every push via `.github/workflows/android-build.yml`

## Troubleshooting

### `invalid source release: 21`

Install Java 21 and export it before building:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

### Gradle sync fails locally

Open Android Studio once with `npm run android:open` and let it finish SDK setup.

### Unsigned release bundle

Run `npm run android:setup-signing` and confirm `android/keystore.properties` exists before `npm run android:bundle`.
