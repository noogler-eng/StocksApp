import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Moon, Sun } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#E0E0E0",
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: isDark ? "#FFFFFF" : "#000000",
    },
    toggleButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#1E1E1E" : "#F2F2F2",
    },
  });

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isDark ? "180deg" : "0deg") }],
  }));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? "#FFFFFF" : "#000000",
        tabBarInactiveTintColor: isDark ? "#AAAAAA" : "#666666",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333" : "#E0E0E0",
          backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
          elevation: 0,
          height: 80,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "700",
        },
        tabBarButton: HapticTab,
      }}
    >
      {/* ===== Home Tab ===== */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Home",
          tabBarIcon: () => null,
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Stock App</Text>

              <TouchableOpacity
                onPress={toggleTheme}
                activeOpacity={0.7}
                style={styles.toggleButton}
              >
                <Animated.View style={iconStyle}>
                  {isDark ? (
                    <Sun size={26} color="#FFD700" />
                  ) : (
                    <Moon size={26} color="#000" />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* ===== Watchlist Tab ===== */}
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: () => null,
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Watchlist's</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
