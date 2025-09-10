import AudioBubble from "@/components/AudioMessage";
import { MicButton } from "@/components/micButton";
import audio from "@assets/tones/start.wav";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
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
  // const { recognizing, transcript, startRecognition, stopRecognition } = useOfflineSTT();

  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 👋", sender: "bot", type: "text" },
    { id: "2", text: "Hi, how are you?", sender: "me", type: "text" },
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const player1 = useAudioPlayer(audio);
  const player2 = useAudioPlayer(audio);
  const status = useAudioPlayerStatus(player1);

  const respond = async () => {
    try {
      // fetch a dummy comment
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/comments?_limit=1&_page=" +
          Math.floor(Math.random() * 500) // pick a random page
      );

      const fakeReply = data[0]?.body || "Hmm... I have nothing to say.";

      const newMessageRes = {
        id: `res-${Date.now().toString()}`,
        text: fakeReply,
        sender: "bot",
        type: "text",
      };

      setMessages((prev) => [newMessageRes, ...prev]);
    } catch (error: any) {
      console.error("Network or API error:", error);
  
      // Different messages for different error types
      let errorMessage = "Sorry, something went wrong.";
  
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Check your network.";
      }
  
      const fallbackMessage = {
        id: `res-${Date.now()}`,
        text: errorMessage,
        sender: "bot",
        type: "text",
      };
  
      setMessages((prev) => [fallbackMessage, ...prev]);
    }
  };

  const record = async () => {
    await player1.play();
    await player1.seekTo(0);
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    console.log("status", status);
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await player2.seekTo(0);
    await player2.play();
    await audioRecorder.stop();
    console.log("recording", audioRecorder.uri);
    if (audioRecorder.uri) {
      // Define where to save (inside app’s documents directory)
      const newPath =
        FileSystem.documentDirectory + `recording-${Date.now()}.m4a`;

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
      respond();
    }
  }
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
        type: "text",
      };
      setMessages((prev) => [newMessage, ...prev]);

      setInput("");
      respond();
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
      } else
        return (
          <View
            style={[
              styles.message,
              item.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={
                item.sender === "me" ? styles.messageText : styles.myMessageText
              }
            >
              {item.text}
            </Text>
          </View>
        );
    };
    return (
      <SafeAreaView style={styles.container}>
        {/* <View style={{ flex: 1, padding: 20 }}>
      <Button
        title={recognizing ? 'Stop Recording' : 'Start Recording'}
        onPress={recognizing ? stopRecognition : startRecognition}
      />
      <Text style={{ marginTop: 20 }}>{transcript}</Text>
    </View>  */}
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
            <MicButton
              isRecording={recorderState.isRecording}
              onPress={recorderState.isRecording ? stopRecording : record}
            />

            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <MaterialIcons name="send" color="white" size={25} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

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
    audioButton: {
      backgroundColor: "#34C759",
      borderRadius: 10,
      padding: 8,
      alignItems: "center",
    },
  });

