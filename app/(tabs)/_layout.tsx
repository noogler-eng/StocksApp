import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Moon, Sun } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import useColors from "@/hooks/useColors";

export default function TabLayout() {
  const { isDark, toggleTheme } = useTheme();
  const colors = useColors();

  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    toggleButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
    },
  });

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isDark ? "180deg" : "0deg") }],
  }));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
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
      {/* 🏠 Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => null,
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("@/assets/images/splash-icon.png")}
                  style={{ width: 50, height: 50, borderRadius: 20 }}
                />
                <Text style={[styles.title, { marginLeft: 10 }]}>
                  Stock App
                </Text>
              </View>

              <TouchableOpacity
                onPress={toggleTheme}
                activeOpacity={0.7}
                style={styles.toggleButton}
              >
                <Animated.View style={iconStyle}>
                  {isDark ? (
                    <Sun size={26} color={colors.accent} />
                  ) : (
                    <Moon size={26} color={colors.textPrimary} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* 📈 Watchlist Tab */}
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
