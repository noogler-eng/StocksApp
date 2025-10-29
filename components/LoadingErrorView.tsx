import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Animated } from "react-native";

export default function LoadingErrorView({ loading, error }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Continuous pulsing for loading
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          }}
          className="items-center"
        >
          <ActivityIndicator size="large" color="#A1A1AA" />
          <Text className="text-gray-400 text-lg mt-4 font-semibold">
            Loading...
          </Text>
        </Animated.View>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Animated.View style={{ opacity: fadeAnim }} className="items-center">
          <Text className="text-red-500 text-lg font-semibold">
            Error Occurred
          </Text>
          <Text className="text-gray-500 mt-2 text-sm px-4 text-center">
            {error.message}
          </Text>
        </Animated.View>
      </View>
    );

  return null;
}
