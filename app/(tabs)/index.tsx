import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import StockCard from "@/components/StockCard";
import LoadingErrorView from "@/components/LoadingErrorView";
import useTopMovers from "@/hooks/useTopMovers";
import useColors from "@/hooks/useColors";

export default function Explore() {
  const colors = useColors();
  const { data, loading, error } = useTopMovers();

  if (loading || error || !data) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  const renderSection = (title: string, list: any[]) => (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.textPrimary,
          }}
        >
          {title}
        </Text>
        <Link
          href={{
            pathname: "/viewall",
            params: {
              title,
              type: title.replace(" ", "_").toLowerCase(),
            },
          }}
        >
          <Text
            style={{
              color: colors.accent,
              fontWeight: "600",
            }}
          >
            View All
          </Text>
        </Link>
      </View>

      <View className="flex-row flex-wrap justify-between px-2">
        {list.slice(0, Math.min(4, list.length)).map((item) => (
          <TouchableOpacity
            className="w-[48%] mb-4"
            key={item.ticker}
            activeOpacity={0.8}
          >
            <StockCard
              symbol={item.ticker}
              price={item.price}
              change={item.change_amount}
              isMain={true}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: 16,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderSection("Top Gainers", data.top_gainers)}
        {renderSection("Top Losers", data.top_losers)}
        {renderSection("Most Active", data.most_actively_traded)}
      </ScrollView>
    </View>
  );
}
