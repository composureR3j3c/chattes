import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 👋", sender: "bot" },
    { id: "2", text: "Hi, how are you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };
    setMessages((prev) => [newMessage, ...prev]); // prepend for FlatList inverted
    setInput("");
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.message,
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

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
        <TouchableOpacity style={styles.micButton} onPress={sendMessage}>
            <MaterialIcons name="mic" color="black" size={20}/>
     </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialIcons name="send" color="white" size={25}/>
     </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9",
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
    marginRight:5,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
});
