import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = { isRecording: boolean; onPress: any };

export function MicButton({ isRecording, onPress }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Loop pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset scale when not recording
      scaleAnim.setValue(1);
    }
  }, [isRecording]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor:isRecording ?"#f48989": "#f1f1f1",
        borderRadius: 9999,
        // borderColor: isRecording ? "#f1f1f1" : "",
        // borderWidth: isRecording ? 2 : 0,
        marginRight: 5,
        paddingHorizontal: 16,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <MaterialIcons
          name={
            isRecording ?
            "mic-none" :
            "mic"
          }
          size={20}
          color={isRecording ? "#7f0202" : "black"}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
