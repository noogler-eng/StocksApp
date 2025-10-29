import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const getRandomColor = () => {
  const colors = ["#FEE2E2", "#FEF9C3", "#DCFCE7", "#E0E7FF", "#F3E8FF"];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
    router.push(`/product/${symbol}`);
  };

  const bgColor = getRandomColor();

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 items-start shadow-xl w-[150px] mx-2"
      onPress={handlePress}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: bgColor }}
      >
        <Text className="text-lg font-bold text-gray-800">
          {symbol?.[0] ?? "?"}
        </Text>
      </View>
      <Text className="text-base font-semibold text-gray-800">{symbol}</Text>
      <Text className="text-sm text-gray-500 mt-1">${price}</Text>
    </TouchableOpacity>
  );
}
