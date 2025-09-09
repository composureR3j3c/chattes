import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";

export function useSpeechRecognition() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  ExpoSpeechRecognitionModule.getPermissionsAsync().then((result) => {
    console.log("Status:", result.status);
    console.log("Granted:", result.granted);
    console.log("Restricted:", result.restricted); // (iOS only)
    console.log("Can ask again:", result.canAskAgain);
    console.log("Expires:", result.expires);
  });

  ExpoSpeechRecognitionModule.requestPermissionsAsync().then((result) => {
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Permissions granted! Start speech recognition, or at some other time...
    ExpoSpeechRecognitionModule.start({ lang: "en-US" });
  });

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  return (
    <View>
      {!recognizing ? (
        <Button title="Start" onPress={handleStart} />
      ) : (
        <Button
          title="Stop"
          onPress={() => ExpoSpeechRecognitionModule.stop()}
        />
      )}

      <ScrollView>
        <Text>{transcript}</Text>
      </ScrollView>
    </View>
  );
}
