import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
// import { getTopMovers } from "@/api/alphaVantage";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";
import useTopMovers from "@/hooks/useTopMovers";

export default function Explore() {
  const { data, loading, error } = useTopMovers();

  if (loading || error || !data) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  const renderSection = (title: string, list: any[]) => (
    <View style={{ marginBottom: 24 }}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold">{title}</Text>
        <Link
          href={{
            pathname: "/viewall",
            params: {
              title: title,
              type: title.replace(" ", "_").toLowerCase(),
            },
          }}
        >
          View All
        </Link>
      </View>
      <View className="flex flex-row flex-wrap justify-between px-4">
        {list.slice(0, list.length > 4 ? 4 : list.length).map((item) => {
          return (
            <TouchableOpacity className="w-[48%] mb-4" key={item.ticker}>
              <StockCard
                symbol={item.ticker}
                price={item.price}
                change={item.change_percentage}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
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
