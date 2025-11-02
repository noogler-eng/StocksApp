import React, { useCallback, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteList, getAll } from "@/storage/watchlistStorage";
import { useRouter, useFocusEffect } from "expo-router";
import useColors from "@/hooks/useColors";

export default function WatchlistScreen() {
  const [lists, setLists] = useState<{ [key: string]: any[] }>({});
  const router = useRouter();
  const colors = useColors();

  // Reload data when screen is focused
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
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          shadowColor: colors.muted,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textPrimary,
                flexShrink: 1,
              }}
            >
              {item}
            </Text>
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                marginLeft: 10,
                backgroundColor: colors.marker,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
            }}
          >
            {lists[item]?.length || 0} stocks
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color={colors.marker} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
      }}
    >
      {Object.keys(lists).length === 0 ? (
        <Text
          style={{
            color: colors.textSecondary,
            textAlign: "center",
            marginTop: 40,
            fontSize: 16,
          }}
        >
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
