import AudioBubble from "@/components/AudioMessage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 👋", sender: "bot", type:"text"},
    { id: "2", text: "Hi, how are you?", sender: "me" , type:"text"},
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    console.log("recording",audioRecorder.uri)
    if (audioRecorder.uri) {
      // Define where to save (inside app’s documents directory)
      const newPath = FileSystem.documentDirectory + `recording-${Date.now()}.m4a`;

      // Move file from cache to permanent storage
      await FileSystem.moveAsync({
        from: audioRecorder.uri,
        to: newPath,
      });

      // Alert.alert("Saved!", `Recording stored at: ${newPath}`);
      console.log("Saved file:", newPath);
       // Add audio message to chat
       const newMessage = {
        id: Date.now().toString(),
        text: newPath,
        sender: "me",
        type: "audio",
      };
      setMessages((prev) => [newMessage, ...prev]);
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);



  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
      type:"audio"
    };
    setMessages((prev) => [newMessage, ...prev]); // prepend for FlatList inverted
    setInput("");
  };

  const renderItem = ({ item }: any) => {
    if (item.type === "audio") {
      return (
        <View
          style={[
            styles.message,
            item.sender === "me" ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <AudioBubble uri={item.text} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.message,
          item.sender === "me" ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={item.sender === "me" ? styles.messageText:styles.myMessageText}>{item.text}</Text>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={90} // adjust if needed (header height etc.)
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.micButton} 
        onPress={recorderState.isRecording ? stopRecording : record}>
            <MaterialIcons name="mic" color="black" size={20} />
            <Text>{recorderState.isRecording ? "Stop Recording" : "Start Recording"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialIcons name="send" color="white" size={25} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    // paddingBottom:20
  },
  message: {
    margin: 8,
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
  },
  messageText: { color: "white" },
  myMessageText: { color: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  micButton: {
    backgroundColor: "#f1f1f1",
    borderRadius: 9999,
    marginRight: 5,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  audioButton:{  backgroundColor: "#34C759",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",}
});
