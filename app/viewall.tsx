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
import useColors from "@/hooks/useColors";

export default function ViewAll() {
  const { title } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();

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
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
      flex: 1,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: colors.textPrimary,
    },
    loadingText: {
      color: colors.textSecondary,
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
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title || "View All"}</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          placeholder="Search stocks..."
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.textPrimary} />
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
