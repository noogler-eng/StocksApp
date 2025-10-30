import React, { useCallback, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteList, getAll } from "@/storage/watchlistStorage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";

export default function WatchlistScreen() {
  const [lists, setLists] = useState<{ [key: string]: any[] }>({});
  const router = useRouter();

  // Reload data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await getAll();
    setLists(data);
  };

  const handleListPress = (listName: string) => {
    router.push({
      pathname: "/watchlistDetail",
      params: { name: listName },
    });
  };

  const renderItem = ({ item }: { item: string }) => {
    const handleDelete = () => {
      Alert.alert(
        "Delete Watchlist",
        `Are you sure you want to delete "${item}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteList(item);
              loadData();
              alert("Watchlist deleted");
            },
          },
        ]
      );
    };

    return (
      <TouchableOpacity
        onPress={() => handleListPress(item)}
        activeOpacity={0.9}
        className="flex-row items-center justify-between bg-white border border-gray-200 p-4 rounded-2xl mb-3 shadow-sm"
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg font-semibold text-gray-900 flex-shrink">
              {item}
            </Text>

            <TouchableOpacity
              onPress={handleDelete}
              className="rounded-full p-2 ml-3 active:bg-red-600"
            >
              <Text className="text-sm bg-red-600 p-1 rounded-lg text-white">
                delete
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-500">
            {lists[item]?.length || 0} stocks
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#aaa" />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-5">
      {Object.keys(lists).length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">
          You haven’t created any watchlists yet.
        </Text>
      ) : (
        <FlatList
          data={Object.keys(lists)}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
