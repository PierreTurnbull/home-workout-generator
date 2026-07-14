#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

KEYSTORE="android/home-workout-generator-release.keystore"
PROPS="android/keystore.properties"
EXAMPLE="android/keystore.properties.example"

if [[ -f "$KEYSTORE" ]]; then
  echo "Keystore already exists at $KEYSTORE"
else
  echo "Creating release keystore..."
  echo "You will be prompted for passwords and certificate details."
  echo "Keep this keystore safe. Google requires the same key for all future updates."
  echo
  keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -alias home-workout-generator \
    -keyalg RSA -keysize 2048 -validity 10000
fi

if [[ ! -f "$PROPS" ]]; then
  cp "$EXAMPLE" "$PROPS"
  echo
  echo "Created $PROPS"
  echo "Edit it now with your keystore passwords."
  "${EDITOR:-nano}" "$PROPS"
else
  echo "$PROPS already exists"
fi

echo
echo "Next steps:"
echo "  1. npm run android:check"
echo "  2. npm run android:bundle"
echo "  3. Upload android/app/build/outputs/bundle/release/app-release.aab to Play Console"
