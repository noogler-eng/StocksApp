import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { View, Text } from "react-native";

export default function LoadingErrorView({ loading, error }: any) {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? "#000" : "#fff";
  const primaryText = isDark ? "#fff" : "#000";
  const secondaryText = isDark ? "#ccc" : "#555";

  if (loading)
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor }}
      >
        <View className="flex items-start">
          <Text style={{ color: primaryText }} className="text-4xl font-bold">
            Loading
          </Text>
          <Text
            style={{ color: secondaryText }}
            className="text-xl font-semibold mt-1"
          >
            Wait a moment...
          </Text>
        </View>
      </View>
    );

  if (error)
    return (
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor }}
      >
        <View className="flex items-start">
          <Text style={{ color: primaryText }} className="text-4xl font-bold">
            Oops!
          </Text>
          <Text
            style={{ color: secondaryText }}
            className="text-xl font-semibold mt-1"
          >
            Something went wrong
          </Text>
          <Text
            style={{ color: secondaryText }}
            className="mt-3 text-center text-base leading-5"
          >
            {error.message || "Unable to load data. Please try again later."}
          </Text>
        </View>
      </View>
    );

  return null;
}
