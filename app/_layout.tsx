import "@/global.css";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext"; // ✅ Import theme context

export const unstable_settings = {
  anchor: "(tabs)",
};

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
