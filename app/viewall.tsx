import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";
import useTopMovers from "@/hooks/useTopMovers";
import { useTheme } from "@/context/ThemeContext";

export default function ViewAll() {
  const { title } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();

  const [stocks, setStocks] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const { data, loading, error } = useTopMovers();

  useEffect(() => {
    if (data) {
      const list =
        title === "Top Gainers"
          ? data.top_gainers
          : title === "Top Losers"
            ? data.top_losers
            : data.most_actively_traded;
      setStocks(list || []);
      setFiltered(list || []);
    }
  }, [title, data]);

  const handleSearch = (text: string) => {
    setQuery(text);
    const filteredList = stocks.filter((item) =>
      item.ticker.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredList);
  };

  if (loading || error) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#E0E0E0",
      backgroundColor: isDark ? "#0D0D0D" : "#FFFFFF",
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#111111",
      flex: 1,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#1A1A1A" : "#F3F4F6",
      marginHorizontal: 16,
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    searchIcon: {
      color: isDark ? "#AAA" : "#888",
    },
    loadingText: {
      color: isDark ? "#AAAAAA" : "#555555",
      marginTop: 8,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? "#FFFFFF" : "#333333"}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title || "View All"}</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={styles.searchIcon.color} />
        <TextInput
          placeholder="Search stocks..."
          placeholderTextColor={isDark ? "#888" : "#666"}
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? "#FFF" : "#000"} />
          <Text style={styles.loadingText}>Loading {title}...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.gridContainer}>
            {filtered.map((item) => (
              <Link key={item.ticker} href={`/product/${item.ticker}`} asChild>
                <TouchableOpacity className="w-[48%] mb-4">
                  <StockCard
                    symbol={item.ticker}
                    price={item.price}
                    change={item.change_amount}
                    isMain={true}
                  />
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
