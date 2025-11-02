import "@/global.css";

import { useEffect } from "react";
import { View } from "react-native";

// expo-router is the file-based navigation system for Expo.
// Stack defines a stack navigator
// where screens are pushed/popped (like pages in a mobile app).
import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// This lets you control the Android navigation bar 
// (the bottom bar with home/back buttons).
import * as NavigationBar from "expo-navigation-bar";

// SafeAreaView ensures your content doesn’t overlap the notch, 
// status bar, or navigation bar on modern phones
import { SafeAreaView } from "react-native-safe-area-context";


// This configuration tells the router to load the "(tabs)"
// layout first when the app starts.
export const unstable_settings = {
  anchor: "(tabs)",
};

// RootLayout is the main layout component for the app.
// It wraps the entire app in a ThemeProvider to manage light/dark themes.
export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedRootLayout />
    </ThemeProvider>
  );
}


function ThemedRootLayout() {
  const { isDark } = useTheme();
  const backgroundColor = isDark ? "#000000" : "#FFFFFF";

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(backgroundColor);
    NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark");
  }, [isDark]);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar
        hidden
        style={isDark ? "light" : "dark"}
        backgroundColor={backgroundColor}
      />

      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor }}
        edges={["top", "left", "right"]}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="viewall" />
          <Stack.Screen name="product/[symbol_price]" />
          <Stack.Screen name="watchlistDetail" />
        </Stack>
      </SafeAreaView>
    </View>
  );
}
