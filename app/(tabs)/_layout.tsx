import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import {
  Text,
  TextInput,
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#1E1E1E" : "#F2F2F2",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      width: "50%",
    },
    searchInput: {
      marginLeft: 8,
      flex: 1,
      fontSize: 16,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    watchlistHeader: {
      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#E0E0E0",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    watchlistTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#000000",
    },
  });

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
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Home",
          tabBarIcon: () => null,
          headerShown: true,
          header: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Stock App</Text>
              <View style={styles.searchBox}>
                <TextInput
                  placeholder="Search here..."
                  placeholderTextColor={isDark ? "#AAA" : "#888"}
                  style={styles.searchInput}
                />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: () => null,
          headerShown: true,
          header: () => (
            <View style={styles.watchlistHeader}>
              <Text style={styles.watchlistTitle}>Watchlist's</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
