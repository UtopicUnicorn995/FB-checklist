import React, { useState } from 'react';
import { Pressable as RNPressable, StyleSheet } from 'react-native';

export default function Pressable({ children, style, onPress, scale = 0.98, opacity = 0.8, ...props }) {
  const [pressed, setPressed] = useState(false);

  return (
    <RNPressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      {...props}
      style={({ pressed: isPressed }) => [
        style,
        {
          transform: [{ scale: isPressed || pressed ? scale : 1 }],
          opacity: isPressed || pressed ? opacity : 1, // Adjust opacity when pressed
        },
      ]}
    >
      {children}
    </RNPressable>
  );
}

const styles = StyleSheet.create({
  // Add reusable styles here if needed
});