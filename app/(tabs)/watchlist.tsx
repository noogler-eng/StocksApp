import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAll } from "@/storage/watchlistStorage";
import { useRouter } from "expo-router";

export default function WatchlistScreen() {
  const [lists, setLists] = useState<{ [key: string]: any[] }>({});
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

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

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => handleListPress(item)}
      className="flex-row items-center justify-between bg-gray-100 p-4 rounded-xl mb-3"
    >
      <View>
        <Text className="text-lg font-semibold text-gray-800">{item}</Text>
        <Text className="text-sm text-gray-500">
          {lists[item]?.length || 0} stocks
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#888" />
    </TouchableOpacity>
  );

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
