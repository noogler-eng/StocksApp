import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from "react-native";
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const styles = StyleSheet.create({
    card: {
      backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
      borderColor: isDark ? "#333" : "#E0E0E0",
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      alignItems: "flex-start",
      width: 150,
      marginHorizontal: 8,
      shadowColor: isDark ? "#000" : "#00000020",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    symbol: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#1F2937", // gray-800
      marginTop: 4,
    },
    price: {
      fontSize: 14,
      color: isDark ? "#AAAAAA" : "#6B7280", // gray-500
      marginTop: 2,
    },
    change: {
      fontSize: 13,
      marginTop: 4,
      fontWeight: "500",
      color:
        change === undefined
          ? isDark
            ? "#AAAAAA"
            : "#6B7280"
          : change >= 0
            ? "#22C55E" // green-500
            : "#EF4444", // red-500
    },
  });

  const handlePress = () => {
    const symbol_price = symbol + "_" + price;
    router.push(`/product/${symbol_price}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Avtaar initials={symbol?.[0] ?? "?"} />
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>${price}</Text>
    </TouchableOpacity>
  );
}
