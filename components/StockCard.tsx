import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Avtaar from "./Avtaar";

export default function StockCard({
  symbol,
  price,
  change,
}: {
  symbol: string;
  price: number;
  change?: number;
}) {
  const router = useRouter();

  const handlePress = () => {
    const symbol_price = symbol + "_" + price;
    router.push(`/product/${symbol_price}`);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 items-start shadow-xl w-[150px] mx-2"
      onPress={handlePress}
    >
      <Avtaar initials={symbol?.[0] ?? "?"} />
      <Text className="text-base font-semibold text-gray-800">{symbol}</Text>
      <Text className="text-sm text-gray-500 mt-1">${price}</Text>
    </TouchableOpacity>
  );
}
