import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { getAll } from "@/storage/watchlistStorage";
import StockCard from "@/components/StockCard";
import { useRouter } from "expo-router";

export default function WatchlistScreen() {
  const [stocks, setStocks] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAll();
    // Flatten all symbols from all watchlists into one array (unique only)
    const allSymbols = Object.values(data).flat();
    const uniqueSymbols: any = Array.from(new Set(allSymbols));
    setStocks(uniqueSymbols);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Your Watchlist
      </Text>

      {stocks.length === 0 ? (
        <Text style={{ color: "#666", textAlign: "center", marginTop: 40 }}>
          No stocks added yet. Go to Explore and add some!
        </Text>
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item}
          numColumns={2}
          renderItem={({ item }) => (
            <StockCard
              symbol={item}
              price={"—"} 
              change={"—"}
              onPress={() => router.push(`/product/${item}`)}
            />
          )}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}
    </View>
  );
}
