#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Checking Android release prerequisites..."
echo

FAIL=0

if command -v java >/dev/null 2>&1; then
  JAVA_VERSION="$(java -version 2>&1 | head -n 1)"
  echo "Java: $JAVA_VERSION"
  if ! java -version 2>&1 | grep -Eq 'version "21'; then
    echo "  ! Java 21 is required for Capacitor 8 builds."
    echo "    Install: brew install --cask temurin@21"
    echo "    Then run: export JAVA_HOME=\$(/usr/libexec/java_home -v 21)"
    FAIL=1
  fi
else
  echo "Java: not found"
  FAIL=1
fi

if [[ -n "${ANDROID_HOME:-}" && -d "$ANDROID_HOME" ]]; then
  echo "Android SDK: $ANDROID_HOME"
elif [[ -d "$HOME/Library/Android/sdk" ]]; then
  echo "Android SDK: $HOME/Library/Android/sdk"
  echo "  Tip: export ANDROID_HOME=\"$HOME/Library/Android/sdk\""
else
  echo "Android SDK: not found"
  echo "  Install Android Studio, then open the project once with: npm run android:open"
  FAIL=1
fi

if [[ -f android/keystore.properties ]]; then
  echo "Release signing: android/keystore.properties found"
else
  echo "Release signing: missing android/keystore.properties"
  echo "  Run: npm run android:setup-signing"
  FAIL=1
fi

if [[ -f android/home-workout-generator-release.keystore ]]; then
  echo "Release keystore: found"
else
  echo "Release keystore: missing"
  echo "  Run: npm run android:setup-signing"
  FAIL=1
fi

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "Ready to build a signed Play Store bundle with: npm run android:bundle"
else
  echo "Fix the items above before uploading to Google Play."
  exit 1
fi
