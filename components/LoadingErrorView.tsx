import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";

export default function LoadingErrorView({ loading, error }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (loading) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [loading]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <View className="flex items-start">
          <Text className="text-black text-4xl font-bold">Loading</Text>
          <Text className="text-xl font-bold">Wait A moment...</Text>
        </View>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 items-center justify-center px-8 bg-white">
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex items-start"
        >
          <Text className="text-black text-4xl font-bold">Oops!</Text>
          <Text className="text-xl font-bold">Something went wrong</Text>
          <Text className="text-gray-400 mt-3 text-center text-base leading-5">
            {error.message || "Unable to load data. Please try again later."}
          </Text>
        </Animated.View>
      </View>
    );

  return null;
}
