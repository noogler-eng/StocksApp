import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAll } from "@/storage/watchlistStorage";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";
import { useTheme } from "@/context/ThemeContext";

export default function WatchlistDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { isDark } = useTheme();

  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading) {
    return <LoadingErrorView loading={loading} error={null} />;
  }

  return (
    <View
      className="flex-1 px-5 pt-6"
      style={{
        backgroundColor: isDark ? "#0B0F19" : "#FFFFFF",
      }}
    >
      <View className="flex-row items-center justify-between mb-5">
        <Text
          style={{
            color: isDark ? "#F1F5F9" : "#1E293B",
          }}
          className="text-2xl font-bold"
        >
          {name}
        </Text>
        <Text
          style={{
            color: isDark ? "#94A3B8" : "#64748B",
          }}
          className="text-base"
        >
          {stocks.length} {stocks.length === 1 ? "stock" : "stocks"}
        </Text>
      </View>

      {stocks.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text
            style={{
              color: isDark ? "#94A3B8" : "#64748B",
            }}
            className="text-base text-center"
          >
            No stocks added in this watchlist yet.
          </Text>
          <Text
            style={{
              color: isDark ? "#64748B" : "#94A3B8",
            }}
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
            <StockCard symbol={item.symbol} price={item.price} />
          )}
        />
      )}
    </View>
  );
}
