#!/bin/bash
set -e

echo "🔹 Step 1: Check node_modules"
if [ -d "node_modules/@jamsch/expo-speech-recognition" ]; then
  echo "✅ @jamsch/expo-speech-recognition exists"
else
  echo "❌ @jamsch/expo-speech-recognition missing! Run npm install"
  exit 1
fi

echo ""
echo "🔹 Step 2: Check android folder"
if [ -d "android" ]; then
  echo "✅ android/ folder exists"
else
  echo "⚠️ android/ folder missing. Run: npx expo prebuild"
  exit 1
fi

echo ""
echo "🔹 Step 3: Check Gradle sees the module"
cd android
echo "Running Gradle dependencies check..."
if ./gradlew :app:dependencies | grep -i "expo-speech-recognition" >/dev/null; then
  echo "✅ Gradle detects expo-speech-recognition"
else
  echo "❌ Gradle does NOT detect expo-speech-recognition"
  echo "Try: npx expo prebuild && ./gradlew clean"
  exit 1
fi

echo ""
echo "🎉 All checks passed! STT module should work in dev build."

