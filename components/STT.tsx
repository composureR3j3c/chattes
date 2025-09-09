import Voice, {
    SpeechErrorEvent,
    SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useEffect, useState } from "react";

export function useSTT() {
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setRecognizedText(e.value[0]); // first result
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.error("STT Error:", e.error);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const start = async () => {
    try {
      await Voice.start("en-US");
      setRecognizedText("");
      setIsListening(true);
    } catch (e) {
      console.error("STT start error:", e);
    }
  };

  const stop = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error("STT stop error:", e);
    }
  };

  return { recognizedText, isListening, start, stop };
}
