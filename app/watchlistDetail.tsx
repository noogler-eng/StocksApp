import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAll } from "@/storage/watchlistStorage";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";

export default function WatchlistDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [stocks, setStocks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAll();
    const list = data[name] || [];  
    setStocks(list);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (refreshing) {
    return <LoadingErrorView loading={refreshing} error={null} />;
  }

  return (
    <View className="flex-1 bg-white px-5 pt-6">
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-2xl font-bold text-gray-800">{name}</Text>
        <Text className="text-gray-500 text-base">
          {stocks.length} {stocks.length === 1 ? "stock" : "stocks"}
        </Text>
      </View>

      {stocks.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500 text-base text-center">
            No stocks added in this watchlist yet.
          </Text>
          <Text className="text-gray-400 text-sm mt-2">
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <StockCard symbol={item.symbol} price={item.price} />
          )}
        />
      )}
    </View>
  );
}
