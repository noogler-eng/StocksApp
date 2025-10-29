import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { getTopMovers } from "@/api/alphaVantage";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";

export default function Explore() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTopMovers();
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title: string, list: any[]) => (
    <View style={{ marginBottom: 24 }}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold">{title}</Text>
        <Link href="/viewall" className="">
          view All
        </Link>
      </View>
      <View className="flex flex-row flex-wrap justify-between px-4">
        {list.slice(0, 4).map((item) => (
          <Link key={item.ticker} href={`/product/${item.ticker}`} asChild>
            <TouchableOpacity className="w-[48%] mb-4">
              <StockCard
                symbol={item.ticker}
                price={item.price}
                change={item.change_percentage}
              />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <LoadingErrorView loading={loading} error={error} />
      {!loading && data && (
        <ScrollView>
          {renderSection("Top Gainers", data.top_gainers)}
          {renderSection("Top Losers", data.top_losers)}
          {renderSection("Most Active", data.most_actively_traded)}
        </ScrollView>
      )}
    </View>
  );
}
