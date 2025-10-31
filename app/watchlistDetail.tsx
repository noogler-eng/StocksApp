import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAll, removeStock } from "@/storage/watchlistStorage";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";
import { useTheme } from "@/context/ThemeContext";

export default function WatchlistDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { isDark } = useTheme();

  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const bgColor = isDark ? "#0D0D0D" : "#FFFFFF";
  const textColor = isDark ? "#F1F5F9" : "#1E293B";
  const subTextColor = isDark ? "#94A3B8" : "#64748B";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      const list = data[name] || [];
      setStocks(list);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRemove = async (symbol: string) => {
    Alert.alert("Remove Stock", `Remove ${symbol} from this watchlist?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeStock(name, symbol);
          await loadData();
        },
      },
    ]);
  };

  if (loading) return <LoadingErrorView loading={loading} error={null} />;

  return (
    <View className="flex-1 px-5 pt-6" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <Text style={{ color: textColor }} className="text-2xl font-bold">
          {name}
        </Text>

        <Text style={{ color: subTextColor }} className="text-base">
          {stocks.length} {stocks.length === 1 ? "stock" : "stocks"}
        </Text>
      </View>

      {/* Empty State */}
      {stocks.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text
            style={{ color: subTextColor }}
            className="text-base text-center"
          >
            No stocks added in this watchlist yet.
          </Text>
          <Text
            style={{ color: isDark ? "#64748B" : "#94A3B8" }}
            className="text-sm mt-2"
          >
            Add some from the Explore tab
          </Text>
        </View>
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item.symbol}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? "#F1F5F9" : "#0F172A"}
            />
          }
          renderItem={({ item }) => (
            <Animated.View style={{ transform: [{ scale: 1 }] }}>
              <StockCard
                symbol={item.symbol}
                price={item.price}
                change={item.change}
                isMain={false}
                onRemove={handleRemove}
              />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
