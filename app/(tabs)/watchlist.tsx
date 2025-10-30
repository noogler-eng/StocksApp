import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteList, getAll } from "@/storage/watchlistStorage";
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function WatchlistScreen() {
  const [lists, setLists] = useState<{ [key: string]: any[] }>({});
  const router = useRouter();
  const { isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
      padding: 20,
    },
    emptyText: {
      color: isDark ? "#AAAAAA" : "#555555",
      textAlign: "center",
      marginTop: 40,
      fontSize: 16,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
      borderColor: isDark ? "#333333" : "#E0E0E0",
      borderWidth: 1,
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: isDark ? "#000" : "#00000020",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    listTitleContainer: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    listName: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#111111",
      flexShrink: 1,
    },
    deleteBtn: {
      marginLeft: 10,
      backgroundColor: "#E63946",
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    deleteText: {
      color: "#FFF",
      fontSize: 12,
      fontWeight: "600",
    },
    stockCount: {
      fontSize: 13,
      color: isDark ? "#AAAAAA" : "#666666",
    },
  });

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
        style={styles.card}
      >
        <View style={styles.listTitleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.listName}>{item}</Text>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.stockCount}>
            {lists[item]?.length || 0} stocks
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color={isDark ? "#AAAAAA" : "#888888"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {Object.keys(lists).length === 0 ? (
        <Text style={styles.emptyText}>
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
