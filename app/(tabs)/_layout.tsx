import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
