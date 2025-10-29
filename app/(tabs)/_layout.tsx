import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Text, TextInput, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 1,
          elevation: 0,
          paddingBottom: 0,
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          borderRightWidth: 1,
          borderRightColor: "#e0e0e0",
        },
        tabBarLabelStyle: {
          textAlignVertical: "center",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Home",
          tabBarIcon: () => null,
          headerShown: true,
          header: () => (
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-2xl font-extrabold text-black">
                Stock App
              </Text>

              <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-xl w-1/2">
                <TextInput
                  placeholder="Search here..."
                  placeholderTextColor="#888"
                  className="ml-2 flex-1 text-base text-black"
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
            <View>
              <Text className="text-2xl font-bold text-black bg-white px-4 py-3 border-b border-gray-200">
                Watchlist's
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
