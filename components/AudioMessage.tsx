// AudioBubble.tsx
import React, { useCallback } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

type Props = { uri: string };

export default function AudioBubble({ uri }: Props) {
  // Important: pass as { uri }
  const player = useAudioPlayer({ uri });

  // Reactive status for UI updates
  const status = useAudioPlayerStatus(player); // { playing, paused, duration, currentTime, ... }

  const toggle = useCallback(async () => {
    // If it already finished, rewind before playing again
    if (!status.playing && status.duration && status.currentTime >= status.duration - 0.05) {
      await player.seekTo(0);
    }
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [status.playing, status.currentTime, status.duration, player]);

  return (
    <TouchableOpacity onPress={toggle} style={{ padding: 10, borderRadius: 8, backgroundColor: '#e5e5ea' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: '600', marginRight: 8 }}>
          {status.playing ? 'Pause' : 'Play'}
        </Text>
        <Text>
          {Math.floor(status.currentTime ?? 0)}s / {Math.floor(status.duration ?? 0)}s
        </Text>
      </View>
    </TouchableOpacity>
  );
}
